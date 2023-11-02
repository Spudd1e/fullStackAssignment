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

    const sql = "SELECT user_id, first_name, last_name, username FROM users WHERE user_id = ?"
    db.get(sql, user_id, (err, user) => {
        if (err) return done(err)

        response.user_id = user.user_id;
        response.first_name = user.first_name;
        response.last_name = user.last_name;
        response.username = user.username;

        const sql = `SELECT f.follower_id, u.first_name, u.last_name, u.username 
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
                db.each(sql, user_id, (err, row) => {
                    if (err) return done(err)
                    posts.getSinglePost(row.post_id, (err, result) => {
                        if (err) return done(err)
                        console.log(result)
                        response.posts.push(result)
                    })
                }, (err, numRows) => {
                return done(null, response)
                    
                })
            })
        })
    })
}


module.exports = {
    getSingleUser: getSingleUser,
    followUser: followUser,
    unfollowUser: unfollowUser
}