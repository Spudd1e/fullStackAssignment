const db = require('../../database')
const posts = require("./post.server.models")
const followUser = (user_id, follower_id, done) => {
    const sql = "SELECT user_id FROM users WHERE user_id = ?"
    db.get(sql, [user_id], (err, row) => {
        if (err) return done(500);

        if (!row) return done(404);
        const sql = "SELECT user_id, follower_id FROM followers WHERE user_id=? AND follower_id=?"
        db.get(sql, [user_id, follower_id], (err, row) => {
            if (err) return done(500);
            if (row) return done(403);
            const sql = "INSERT INTO followers (user_id, follower_id) VALUES (?, ?)"
            db.run(sql, [user_id, follower_id], (err) => {
                if (err) return done(500);
            })
            return done(null)
        })
    })

}
const unfollowUser = (user_id, follower_id, done) => {
    const sql = "SELECT user_id FROM users WHERE user_id=?"
    db.get(sql, user_id, (err, row) => {
        if (err) return done(err);
        if (!row) return done(404)


        const sql = "SELECT user_id, follower_id FROM followers WHERE user_id =? AND follower_id = ?"
        db.get(sql, [user_id, follower_id], (err, row) => {
            if (err) return done(err);
            if (!row) return done(403);


            const sql = `SELECT user_id, follower_id 
            FROM followers 
            WHERE user_id =? 
            AND follower_id = ?`
            db.get(sql, [user_id, follower_id], (err, row) => {
                if (err) return done(err);
                if (!row) return done(403);

                const sql = `DELETE FROM followers 
            WHERE user_id =? 
            AND follower_id = ?`

                db.run(sql, [user_id, follower_id], (err) => {
                    if (err) return done(err);
                    return done(null)
                })
            })
        })
    })
}
const getSingleUser = (user_id, done) => {
    const response = {
        user_id: null,
        first_name: null,
        last_name: null,
        username: null,
        followers: [],
        following: [],
        posts: []
    }


    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username 
        FROM users u
        WHERE user_id=?`
    db.get(sql, user_id, (err, row) => {
        if (err) return done(err)
        if (!row) return done(404)
        response.user_id = row.user_id;
        response.first_name = row.first_name;
        response.last_name = row.last_name;
        response.username = row.username;

        const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username 
            FROM followers f, users u 
            WHERE f.user_id = ? 
            AND f.follower_id = u.user_id`;
        db.each(sql, user_id, (err, follower) => {
            if (err) return done(err);
            response.followers.push(follower)
        }, (err, count) => {
            if (err) return done(err)

            const sql = `SELECT f.user_id, u.first_name, u.last_name, u.username 
            FROM followers f, users u 
            WHERE f.follower_id = ? 
            AND f.user_id = u.user_id`;
            db.each(sql, user_id, (err, row) => {
                if (err) return done(err)
                response.following.push(row)
            }, (err, count) => {
                if (err) return done(err)
                const sql = "SELECT post_id FROM posts WHERE author_id = ?"
                let promises = []
                db.each(sql, user_id, (err, row) => {
                    if (err) return done(err)
                    promises.push(new Promise(function (resolve, reject) {
                        posts.getSinglePost(row.post_id, (err, result) => {
                            if (err) return done(err)
                            console.log("PUSH")

                            resolve(result)
                        })
                    }));
                }, (err) => {
                    Promise.all(promises).then((values) => {
                        console.log("DONE")

                        values.forEach((value) => {
                            response.posts.push(value)
                        })
                        return done(null, response)
                    })
                })
            })
        })
    })
}


const searchUser = (search, done) => {
    let value = ('%' + search + '%')

    if (search === undefined) {
        const sql = `SELECT user_id, first_name, last_name, username FROM users`
        db.all(sql, (err, rows) => {
            console.log(err)
            console.log("HERE")
            if (err) return done(err)
            if (!rows) return done(400)
            return done(null, rows);
        })
    } else {
        const sql = `SELECT user_id, first_name, last_name, username 
            FROM users 
            WHERE first_name LIKE ?1 OR last_name LIKE ?1 OR username LIKE ?1`
        db.all(sql, value, (err, rows) => {
            console.log(err)
            console.log("HERE")
            if (err) return done(err)
            if (!rows) return done(400)
            return done(null, rows);
        })
    }
}

const getFeed = (user_id, done) => {
    let feed = [];
    let promises = []
    if (user_id) {
        const sql = `SELECT post_id 
        FROM Posts WHERE author_id = ?`
        db.each(sql, user_id, (err, row) => {
            if (err) return done(err);
            promises.push(new Promise(function (resolve) {
                console.log("LOGGED IN: " + row.post_id)
                posts.getSinglePost(row.post_id, (err, post) => {
                    if (err) return done(err);
                    resolve(post)
                })
            }))
        }, (err) => {
            const sql = `SELECT p.post_id
            FROM Followers f, Posts p
            WHERE f.follower_id =?1 AND (p.author_id = f.user_id)
            ORDER BY p.date_published DESC`
            db.each(sql, user_id, (err, row) => {
                if(err) return done(err);

                promises.push(new Promise(function(resolve){
                    posts.getSinglePost(row.post_id, (err, post) => {
                        if(err) return done(err)
                        resolve(post)
                    })
                }))
            },(err)=> {
                Promise.all(promises).then((values) => {
                    values.forEach((value) => {
                        feed.push(value);
                    })
                    return done(null, feed);
                })
            })


            
        })
    }
    if(user_id === null) {
        const sql = "SELECT post_id FROM Posts ORDER BY date_published DESC"
        console.log(sql)
        db.each(sql, (err, row) => {
            if (err) return done(err)
            console.log(row.post_id)
            promises.push(new Promise(function (resolve) {
                posts.getSinglePost(row.post_id, (err, post) => {

                    if (err) return done(err)
                    resolve(post)
                })
            }))
        }, (err) => {
            Promise.all(promises).then((values) => {
                values.forEach((value) => {
                    feed.push(value)
                })
                return done(null, feed)
            })
        })
    }
}


module.exports = {

    getSingleUser: getSingleUser,
    followUser: followUser,
    unfollowUser: unfollowUser,
    searchUser: searchUser,
    getFeed: getFeed


}