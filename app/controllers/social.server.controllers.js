const socials = require('../models/social.server.models');
const { getIdFromToken } = require('../models/user.server.models');


const get_single_user = (req, res) => {
    let user_id = parseInt(req.params.user_id)
    socials.getSingleUser(user_id, (err, userDetails) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);
        return res.status(200).send(userDetails)
    })
}

const follow_user = (req, res) => {
    let user_id = parseInt(req.params.user_id);
    getIdFromToken(req.get('X-Authorization'), (err, follower_id) => {
        if (err) return res.sendStatus(401);
        socials.followUser(user_id, follower_id, (err) => {
            if (err === 403) return res.sendStatus(403)
            if (err === 404) return res.sendStatus(404)
            if (err === 500) return res.sendStatus(500)
            return res.sendStatus(200)
        })
    })
}

const unfollower_user = (req, res) => {
    let user_id = parseInt(req.params.user_id);
    getIdFromToken(req.get('X-Authorization'), (err, follower_id) => {
        if (err) return res.sendStatus(401);
        socials.unfollowUser(user_id, follower_id, (err) => {
            if (err === 403) return res.sendStatus(403);
            if (err === 404) return res.sendStatus(404)
            if (err) return res.sendStatus(500);
            return res.sendStatus(200)
        })
    })
}

const search_user = (req, res) => {
    let search = req.query.q
    console.log(search)
    console.log("SEARCH VVV")
    socials.searchUser(search, (err, result) => {
        if (err == 400) res.sendStatus(400)
        if (err) return res.sendStatus(500)
        return res.status(200).send(result)
    })

}

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
        socials.getFeed(user_id, (err, feed) => {
            if (err) return res.sendStatus(500);
            return res.status(200).send(feed);
        })
    })
}


module.exports = {
    get_single_user: get_single_user,
    follow_user: follow_user,
    unfollow_user: unfollower_user,
    search_user: search_user,
    get_feed: get_feed
}