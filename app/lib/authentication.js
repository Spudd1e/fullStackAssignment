const users = require("../models/user.server.models")

const isAuthorised = function(req, res, next){
    const token = req.get('X-Authorization')
    console.log("TOKEN: " + token)
    users.getIdFromToken(token, (err, id) => {
        if(token === undefined || err || id === null || token === '')
            return res.sendStatus(401);
        next()
    })
}

module.exports = {
    isAuthorised :isAuthorised
}