const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db =require('../models/sql');
const User = db.User;

const createUser = (req, res) => {
    // const { errors, isValid } = validateRegisterForm(req.body);
    let {
        name,
        role,
        email,
        password,
    } = req.body;

    // check validation
    // if(!isValid) {
    //     return res.status(400).json(errors);
    // }

    User.findAll({ where: { email } }).then(user => {
        if (user.length) {
            return res.status(400).json({ email: 'Email already exists!' });
        } else {
            let newUser = {
                name,
                role,
                email,
                password,
            };
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    User.create(newUser)
                        .then(user => {
                            res.json({ user });
                        })
                        .catch(err => {
                            res.status(500).json({ err });
                        });
                });
            });
        }
    });
};

module.exports={
    createUser:createUser
};