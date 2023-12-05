const posts = require('../models/post.server.models')
const db = require('../../database')
const getFeed = (user_id, done) => {
    let feed = [];
    let promises = []
    if (user_id) {
        const sql = `SELECT DISTINCT post_id FROM Posts, Followers WHERE author_id = ?1 OR (author_id = user_id AND follower_id = ?1) ORDER BY date_published DESC`
        db.each(sql, user_id, (err, row) => {
            if (err) return done(err);
            promises.push(new Promise(function (resolve) {
                posts.getSinglePost(row.post_id, (err, post) => {
                    if (err) return done(err)
                    resolve(post)
                })
            }))
        }, (err) => {
                Promise.all(promises).then((values) => {
                    values.forEach((value) => {
                        feed.push(value);
                    })
                    return done(null, feed)
                });
            })
    }
    if (user_id === null) {
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
    getFeed: getFeed
}