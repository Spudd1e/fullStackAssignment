const socials = require('../models/social.server.models')


const get_single_user = (req, res) => {
    socials.getSingleUser(req.params.user_id, (err, userDetails) => {
        if(err === 404) return res.sendStatus(404);

        if(err) return res.sendStatus(500);
        return res.status(200).send({Details : userDetails})
    })
}

module.exports = {
    get_single_user : get_single_user
}