const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const friendRequest = require('../models/friendRequest');
const User = require('../models/user');


const USER_DATA = 'firstName lastName age photoUrl about skills';
//all pending requests from loggedIn user
userRouter.get('/user/requests/received/pending', userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const FriendRequest = await friendRequest.find({
            toUserId: loggedInUser._id,
            requestStatus: 'Interested',
        }).populate(
            'fromUserId', USER_DATA);

        res.json({
            message: 'Pending requests fetched!!!',
            data: FriendRequest,
        });

    } catch (error) {
        res.status(401).send('Some error occured ' + error.message);
    }
});

//all friends
userRouter.get('/user/friends', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const friends = await friendRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, requestStatus: 'Accepted' },
                { toUserId: loggedInUser._id, requestStatus: 'Accepted' }
            ]
        })
            .populate('fromUserId', USER_DATA)
            .populate('toUserId', USER_DATA);

        console.log(friends);

        const data = friends.map((row) => {
            if (row.fromUserId.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            else {
                return row.fromUserId;
            }
        });

        console.log(data);

        res.json({ data });

    } catch (error) {
        res.status(401).send('Some error occured while fetching friends ' + error.message);
    }
});

//user's feed/homepage
userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1)*10;

        const loggedInUserConnections = await friendRequest.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ],
        }).select('fromUserId  toUserId');

        const usersToHideFromFeed = new Set();

        loggedInUserConnections.forEach((i) => {
            usersToHideFromFeed.add(i.fromUserId.toString());
            usersToHideFromFeed.add(i.toUserId.toString());
        });

        const usersToShow = await User.find({
            $and: [
                { _id: { $nin: Array.from(usersToHideFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
        .select(USER_DATA)
        .skip(skip)
        .limit(limit);

        res.json({ data: usersToShow });
    } catch (error) {
        res.status(401).send('Some error occured creating your feed!!!' + error.message);
    }
});

module.exports = { userRouter };
