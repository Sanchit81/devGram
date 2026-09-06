const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://itsmeraisanchit987_db_user:0wuS3LyhEgY00VdX@devgram.xeqfbco.mongodb.net/devDB"
    );
};


module.exports = connectDB;