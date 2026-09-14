const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {editProfileValidate} = require('../utils/validate');

profileRouter.get('/profile/view',userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(500).send("Can't access profile" + error.message);
    }
});

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    try {
        if(!editProfileValidate(req)){
            throw new Error('Profile cannot be updated');
        }

        const loggedUser = req.user;
        
        Object.keys(req.body).forEach((key)=>(loggedUser[key]=req.body[key]));

        await loggedUser.save();
        res.send(`${loggedUser.firstName}, profile updated successfully`);
    } catch (error) {
        res.status(401).send('User profile cannot be updated');
    }
});

module.exports = {profileRouter};