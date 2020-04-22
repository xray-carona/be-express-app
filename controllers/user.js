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

const loginUser = (req, res) => {
    // const { errors, isValid } = validateLoginForm(req.body);
    //
    // // check validation
    // if(!isValid) {
    //     return res.status(400).json(errors);
    // }

    const { email, password } = req.body;
    let errors={}
    User.findAll({
        where: {
            email
        }
    })
        .then(user => {

            //check for user
            if (!user.length) {
                errors.email = 'User not found!';
                return res.status(404).json(errors);
            }

            let originalPassword = user[0].dataValues.password

            //check for password
            bcrypt
                .compare(password, originalPassword)
                .then(isMatch => {
                    if (isMatch) {
                        // user matched
                        console.log('matched!')
                        const { user_id, email,name,createdAt } = user[0].dataValues;
                        // console.log(user[0].dataValues)
                        const payload = { user_id, email,name,createdAt }; //jwt payload
                        // console.log(payload)

                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token,
                                role: user[0].dataValues.role
                            });
                        });
                    } else {
                        errors.password = 'Password not correct';
                        return res.status(400).json(errors);
                    }
                }).catch(err => console.log(err));
        }).catch(err => res.status(500).json({err}));
};

const getUserId =(email) =>{

}

module.exports={
    createUser:createUser,
    loginUser:loginUser
};