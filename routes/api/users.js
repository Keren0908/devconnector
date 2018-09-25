const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// load user model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Test user route
// @access  Public
router.get('/test', (req,res) => {
    res.json({msg: "Users Works"});
});

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register',(req,res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if(user){
            return res.status(400).json({email: 'Email already exists'});
        }
        else{
            const avatar = gravatar.url(req.body.email, {
                s: '200', //size
                r: 'pg', //rating
                d: 'mm' //Default
             });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar, //node gravatar
                password: req.body.password //need to encrypt
            });
            
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                })}); 
        }});      
});

// @route   GET api/users/login
// @desc    Login user // Returning JWT Token
// @access  Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find the user by email
    User.findOne({email})
        .then(user => {
            //check for user
            if(!user){
                return res.status(404).json({email: "User Not Found!"});
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        res.json({msg: "Success"});
                    }
                    else{
                        return res.status(400).json({password: 'Password Incorrect!'});
                    }
                })
        });
});

module.exports = router;