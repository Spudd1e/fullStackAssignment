const db = require('../../database')

const followUser = (user_id, follower_id, done) => {
    const sql = "SELECT user_id FROM users WHERE user_id = ?"
    db.get(sql, [user_id], (err, row)=> {
        if(err) return done(500);

        if(!row) return done(404);
        const sql = "SELECT user_id, follower_id FROM followers WHERE user_id=? AND follower_id=?"
        db.get(sql, [user_id, follower_id], (err, row)=> {
            if(err) return done(500);
            if(row) return done(403);
            const sql = "INSERT INTO followers (user_id, follower_id) VALUES (?, ?)"
            db.run(sql, [user_id, follower_id], (err)=> {
                if(err) return done(500);
            })
            return done(null)
        })
    })
    
}
const unfollowUser = (user_id, follower_id, done) => {
    const sql = "SELECT user_id FROM users WHERE user_id=?"
    db.get(sql, user_id, (err,row)=>{
        if(err) return done(err);
        if(!row) return done(404)



    const sql = "SELECT user_id, follower_id FROM followers WHERE user_id =? AND follower_id = ?"
    db.get(sql, [user_id, follower_id], (err,row)=> {
        if(err) return done(err);
        if(!row) return done(403);
        
        const sql = "DELETE FROM followers WHERE user_id =? AND follower_id = ?"
        db.run(sql, [user_id, follower_id], (err)=>{
            if(err) return done(err);
            return done(null)
        })        
    })
    })
}

module.exports = {
    followUser : followUser,
    unfollowUser : unfollowUser
}