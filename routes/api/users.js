const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
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
    const { errors, isValid } = validateRegisterInput(req.body);

    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
    .then(user => {
        if(user){
            errors.email = 'Email already exists';
            return res.status(400).json({errors});
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

    const { errors, isValid } = validateLoginInput(req.body);
    
    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    //Find the user by email
    User.findOne({email})
        .then(user => {
            //check for user
            if(!user){
                errors.email = "User Not Found"
                return res.status(404).json({errors});
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        //User Matched
                        const payload = { id: user.id, name: user.name, avatar: user.avatar} //create jwt payload
                        
                        // Sign Token
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 }, 
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                        });
                    }
                    else{
                        errors.password = "Password Incorrect"
                        return res.status(400).json({errors});
                    }
                })
        });
});

// @route   GET api/users/current
// @desc    Return the current user 
// @access  Private
router.get('/current', passport.authenticate('jwt', {session:false}),(req,res) =>{
    // the token would put the current user to req 
    res.json(req.user);
});

// @route   DELETE api/users
// @desc    Delete the current user 
// @access  Private
router.delete('/', passport.authenticate('jwt', {session:false}),(req,res) =>{
    // the token would put the current user to req 
    User.findOneAndRemove({ _id: req.user.id })
    .then(profile => {
        res.json(profile)
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;