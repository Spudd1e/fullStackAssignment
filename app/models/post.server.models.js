const db = require('../../database');
const crypto = (require('crypto'));

const addNewPost = (post, done) => {
    const sql = 'INSERT INTO posts (text, date_published, author_id) VALUES (?, ?, ?)';
    let values = [post.text, Date.now(), 1]

    db.run(sql, values, function (err) {
        if (err)
            return done(err);
        return done(null, this.lastID)
    })
}
const getSinglePost = (post_id, done) => {
    const sql = 'SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username FROM posts p, users u WHERE p.post_id=? AND p.author_id = u.user_id';

    db.get(sql, [post_id], function (err, post_details) {
        if (err) return done(err)
        if (!post_details){
            console.log("No post details")
             return done(404);
        }

        const sql = 'SELECT u.user_id, u.first_name, u.last_name, u.username FROM users u, likes l WHERE l.post_id=? AND l.user_id=u.user_id'
        const likes = [];
        db.each(sql, [post_id], (err, row) => {
            if (err) return done(err);
            likes.push({
                user_id: post_details.user_id,
                first_name: post_details.first_name,
                last_name: post_details.last_name,
                username: post_details.username
            })
        },
            (err, num_rows) => {
                if (err) return done(err)

                return done(null, {
                    post_id: post_details.post_id,
                    timestamp: post_details.date_published,
                    text: post_details.text,
                    author: {
                        user_id: post_details.user_id,
                        first_name: post_details.first_name,
                        last_name: post_details.last_name,
                        username: post_details.username
                    },
                    likes: likes
                });
            }
        )
    })
}
const updatePost = (post_id, new_text, done) => {
    const sql = "UPDATE posts SET text=? WHERE post_id=?";

    db.run(sql, [new_text, post_id], (err) => {
        return done(err);
    })
}
const deletePost = (post_id, done) => {
    const sql = "DELETE FROM posts WHERE post_id=?";
    db.run(sql, [post_id], (err) => {
        return done(err)
    })
}
const addLike = (post_id, done) => {
    const sql = 'INSERT INTO likes (post_id, user_id) VALUES (?,?)'
    const values = [post_id, 6]
    db.run(sql, values, (err) => {
        if (err) return done(err)
        db.all("SELECT l.post_id FROM likes l WHERE l.post_id=?", [post_id], (err, rows) => {
            if (err) return done(err)
            return done(null, rows.length);
        })
    })
}
const removeLike = (post_id, done) => {
    const sql = 'DELETE FROM likes WHERE post_id=?';
    db.run(sql, post_id, (err) => {
        if (err) return done(err)
        db.all("SELECT l.post_id FROM likes l WHERE l.post_id=?", [post_id], (err, rows) => {
            if (err) return done(err)
            return done(null, rows.length);
        })
    })
}



module.exports = {
    addNewPost: addNewPost,
    getSinglePost: getSinglePost,
    updatePost: updatePost,
    deletePost: deletePost,
    addLike: addLike,
    removeLike: removeLike,
};