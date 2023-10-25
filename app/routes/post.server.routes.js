const posts = require('../controllers/post.server.controllers');
const auth = require('../lib/authentication')

module.exports = function(app){
    app.route('/posts')
        .post(auth.isAuthorised,posts.add_post);

    app.route('/posts/:post_id')
        .get(posts.get_post)
        .patch(posts.update_post)
        .delete(posts.delete_post)

    app.route('/posts/:post_id/like')
        .post(posts.add_like)
        .delete(posts.remove_like)

};