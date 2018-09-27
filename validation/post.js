const isEmpty = require('./is-empty');
const Validator = require('validator');


module.exports = function validatePostInput(data) {
    let errors = {};


    data.text = !isEmpty(data.text) ? data.text : '';
    //data.commentstext = !isEmpty(data.password) ? data.password : '';
    
    if(!Validator.isLength(data.text, {min: 10, max: 300 })){
        errors.text = 'Post must between 10 and 300 characters';
    }

    if(Validator.isEmpty(data.text)){
        errors.text= 'Text field is required';
    }

    
    

    return {
        errors,
        isValid: isEmpty(errors)
    }
    
}