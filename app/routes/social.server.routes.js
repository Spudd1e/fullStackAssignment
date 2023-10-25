const socials = require("../controllers/social.server.controllers");


module.exports = function(app){
    app.route("/users/:user_id")
        .get(socials.get_single_user)
}