const mongoose = require('mongoose');

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
    },
    age: {
        type: Number,
        min: 18,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male','female','others'],
    },
    photoURL: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
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

module.exports = mongoose.model("User",userSchema);