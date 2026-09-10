const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid email id!')
            }
        },
    },
    age: {
        type: Number,
        min: 18,
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Enter a strong password!')
            }
        },
    },
    gender: {
        type: String,
        enum: ['male','female','others'],
    },
    photoURL: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Invalid URL')
            }
        },
    },
    about: {
        type: String,
        default: "Welcome to my account",
    },
    skills: {
        type: [String],
    },
},
    {
        timestamps: true,
});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"dkggjif5675gdf",{
        expiresIn: '7d'
    })

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const hashPassword = user.password;
    const isValid = await bcrypt.compare(
        passwordInputByUser,
        hashPassword,
    );

    return isValid;
};

module.exports = mongoose.model("User",userSchema);