const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    requestStatus: {
        type: String,
        required: true,
        enum:["Ignored","Interested","Accepted","Rejected"], 
    },
},
{
    timestamps: true,
}
);

friendRequestSchema.pre("save",function(){
    const friendRequest = this;
    if(friendRequest.fromUserId.equals(friendRequest.toUserId)){
        throw new Error('You cannot send a friend request to your own id!!');
    }
});

const friendRequestModel = new mongoose.model(
    "friendRequest",
    friendRequestSchema
);

module.exports = friendRequestModel;