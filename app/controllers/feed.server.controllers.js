const { getIdFromToken } = require('../models/user.server.models');
const feed = require('../models/feed.server.model')

const get_feed = (req, res) => {
    let token = req.get('X-Authorization')
    getIdFromToken(token, (err, id) => {
        let user_id = -1;
        if (err === 404)
            user_id = null;
        if (id)
            user_id = id
        if(user_id === -1)
            return res.sendStatus(500)
        feed.getFeed(user_id, (err, feed) => {
            if (err) return res.sendStatus(500);
            return res.status(200).send(feed);
        })
    })
}

module.exports = {
    get_feed: get_feed
}