const posts = require('../models/post.server.models')
const db = require('../../database')
const getFeed = (user_id, done) => {
    let feed = [];
    let promises = []
    if (user_id) {
        const sql = `SELECT post_id 
        FROM Posts WHERE author_id = ?`
        db.each(sql, user_id, (err, row) => {
            if (err) return done(err);
            promises.push(new Promise(function (resolve) {
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
        db.each(sql, (err, row) => {
            if (err) return done(err)
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
    getFeed : getFeed
}