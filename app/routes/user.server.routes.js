const users = require('../controllers/user.server.controllers');
const auth = require('../lib/authentication');

module.exports = function(app){
    app.route("/users")
        .post(users.add_new_user)

    app.route("/login")
        .post(users.authenticate_user)
    
    app.route("/logout")
        .post(auth.isAuthorised, users.logout)
};