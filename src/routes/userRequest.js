const express = require('express');
const reqRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const friendRequest = require('../models/friendRequest');

reqRouter.post('/friendRequest/send/:requestStatus/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const requestStatus = req.params.requestStatus;
        const allowedStatus = ["Ignored","Interested"];

        if (!allowedStatus.includes(requestStatus)) {
            return res
                .status(400)
                .json({ message: "Invalid status type: " + requestStatus });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res
                .status(400)
                .json({ message: "User does not exist!!" });
        }

        const existingFriendRequest = await friendRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingFriendRequest) {
            return res
                .status(400)
                .send({ message: "Friend request already sent!!" });
        }

        const FriendRequest = new friendRequest({
            fromUserId,
            toUserId,
            requestStatus,
        });

        const data = await FriendRequest.save();

        res.json({
            message:
                req.user.firstName + " is " + requestStatus + " in " + toUser.firstName,
            data,
        });
    } catch (error) {
        res.status(400).send('Some issue occured sending the request' + error.message);
    };
}
);


reqRouter.post('/friendRequest/review/:status/:requestId',userAuth,async (req,res)=>{
    try {

        const loggedInUser = req.user;
        const {requestId,status} = req.params;

        const allowedStatus = ['Accepted','Rejected'];
        if(!allowedStatus.includes(status)){
            throw new error('Status invalid!!');
        }

        const FriendRequest = await friendRequest.findOne({
            toUserId: loggedInUser._id,
            requestStatus: 'Interested',
            _id: requestId,
        });

        if(!FriendRequest){
            throw new error('No such request exists!!');
        }

        FriendRequest.requestStatus = status;

        const data = await FriendRequest.save();

        res.json({
            message: 'Connection request ' +status,data
        });
    } catch (error) {
        res.status(401).send('Some error occured '+error.message);
    }
})

module.exports = { reqRouter };