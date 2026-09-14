const express = require('express');
const authRouter = express.Router();
const {validateSignUp} = require('../utils/validate');
const bcrypt = require('bcrypt');
const User = require('../models/user');

authRouter.post('/signUp', async (req, res) => {
    try {
        validateSignUp(req);
        const { firstName, lastName, email, password ,age} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
        })
        await user.save();
        res.send('User signed up successfully');
    } catch (error) {
        res.status(500).send('Error signing up the user' + error.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email: email});
        if (!user) {
            throw new Error('Invalid Credentials!!');
        }

        const isPassValid = await user.validatePassword(password);
        if (isPassValid) {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login successfull!!");
        } else {
            throw new Error("Invalid Credentials!!");
        }
    } catch (error) {
        res.status(501).send('User login failed!!' + error.message);
    }
});

authRouter.post('/logout',async (req,res)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now())
    });
    res.send('User logged out successfully!!');
});


module.exports = {authRouter};