const users = require("../models/user.server.models")
const Joi = require("joi");

const add_new_user = (req, res) => {
    const schema = Joi.object({
        first_name : Joi.string().required(),
        last_name : Joi.string().required(),
        username : Joi.string().required(),
        password : Joi.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*@£%^&*()!]).{8,32}$/).required()
    });
    const {error} = schema.validate(req.body)
    console.log(error);
    if(error)   return res.status(400).send({error_message : error.details[0].message});
    let user = Object.assign({}, req.body);
    users.addNewUser(user,(err, result)=> {
        if(err) {
            return res.sendStatus(400);
        }
        return res.status(201).send({user_id : result})
    })
}

const authenticate_user = (req, res) => {
    const schema = Joi.object({
        username : Joi.string().required(),
        password : Joi.string().required()
    })

    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send({error_message : error.details[0].message})

    users.authenticateUser(req.body.username, req.body.password, (err, id) => {
        if(err === 400) return res.status(400).send({error_message: err});
        if(err) return res.sendStatus(500);

        users.getToken(id, (err, token) => {
            if (err) return res.sendStatus(500);

            if(token){
                console.log("token Exists")
                return res.status(200).send({user_id : id, session_token: token})
            }else{
                console.log("Token created")
                users.setToken(id, (err, token) =>{
                    if(err) return res.sendStatus(500);
                    return res.status(200).send({user_id :id, session_token : token})
                })
            }
        })
    })
}
const logout = (req, res) => {
    users.removeToken(req.get('X-Authorization'), (err)=>{
        if(err) return res.sendStatus(500)
        return res.sendStatus(200);
    })
}

module.exports = {
    add_new_user : add_new_user,
    authenticate_user : authenticate_user,
    logout : logout,
}