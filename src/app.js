const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');


const {authRouter} = require('./routes/auth');
const {profileRouter} = require('./routes/profile');
const {reqRouter} = require('./routes/userRequest');
const {userRouter} = require('./routes/user');

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',reqRouter);
app.use('/',userRouter);


connectDB()
    .then(() => {
        console.log('Database connected successfully');
        app.listen(3000, () => {
            console.log('Server successfully listening on port 3000');
        });
    })
    .catch((err) => {
        console.error('Cannot connect to database!');

    });

  