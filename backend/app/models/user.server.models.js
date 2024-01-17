
const db = require("../../database")
const crypto = require('crypto')

const getHash = function (password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};

const addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);
    let firstName = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    let lastName = user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1);
    const sql = 'INSERT INTO users (first_name, last_name, username, password, salt) VALUES (?, ?, ?, ?, ?)'
    let values = [firstName, lastName, user.username, hash, salt.toString('hex')]

    db.run(sql, values, function (err) {
        if (err) return done(err)
        return done(null, this.lastID)
    })
}

const authenticateUser = (username, password, done) => {
    const sql = "SELECT user_id, password, salt FROM users WHERE username=?"

    db.get(sql, [username], function (err, row) {
        if (err) return done(err)

        if (!row) return done(400)//wrong username

        if (row.salt === null) row.salt = ''

        let salt = Buffer.from(row.salt, 'hex')

        if (row.password === getHash(password, salt)) {
            return done(false, row.user_id);
        } else {
            return done(400)//wrong password
        }

    })
}
const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');

    const sql = 'UPDATE users SET session_token=? WHERE user_id=?'

    db.run(sql, [token, id], (err) => {
        if(err) return done(err);
        return done(null, token)
    })
}

const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id=?'
    db.get(sql, [id], (err, row)=>{
        if(err) return done(err);
        return done(null, row.session_token)
    })
}

const removeToken = (token, done) => {
    const sql = "UPDATE users SET session_token = null WHERE session_token=?"

    db.run(sql, [token], (err)=>{
        return done(err);
    })
}

const getIdFromToken = (token, done) => {
    const sql = 'SELECT user_id FROM users WHERE session_token=?'
    db.get(sql, [token], (err, row) => {
        
        if(err) return done(err)
        if(!row) return done(404)
        return done(null, row.user_id)
    })
}



module.exports = {
    addNewUser: addNewUser,
    setToken : setToken,
    authenticateUser: authenticateUser,
    getToken: getToken,
    removeToken : removeToken,
    getIdFromToken : getIdFromToken,

}