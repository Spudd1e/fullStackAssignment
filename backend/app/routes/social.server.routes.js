const socials = require("../controllers/social.server.controllers");
const auth = require("../lib/authentication")

module.exports = function(app){
    app.route("/users/:user_id")
        .get(socials.get_single_user)

    app.route('/users/:user_id/follow')
        .post(auth.isAuthorised, socials.follow_user)
        .delete(auth.isAuthorised, socials.unfollow_user)

    app.route('/search')
        .get(socials.search_user)

};