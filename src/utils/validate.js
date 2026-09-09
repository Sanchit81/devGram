const validator = require('validator');

const validateSignUp = (req)=>{
    const {firstName,lastName,email,password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Invalid name");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Invalid email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Create a strong password");
    }
};

module.exports = {validateSignUp};