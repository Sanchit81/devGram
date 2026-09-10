const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error('Invalid token!!!');
        }

        const decode = await jwt.verify(token, "dkggjif5675gdf");
        const {_id} = decode;
        
        const user = await User.findById(_id);

        if (!user) {
            throw new Error('User does not exist!!');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send("Something went wrong!!" +error.message);
    }
};

module.exports = {userAuth};