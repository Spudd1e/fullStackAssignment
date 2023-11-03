const db = require('../../database')

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

            const sql = "DELETE FROM followers WHERE user_id =? AND follower_id = ?"
            db.run(sql, [user_id, follower_id], (err) => {
                if (err) return done(err);
                return done(null)
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

module.exports = {
    followUser: followUser,
    unfollowUser: unfollowUser,
    searchUser: searchUser
}