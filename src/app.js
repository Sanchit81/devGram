const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post('/signUp', async (req, res) => {
    const user = new User({
        firstName: "John",
        lastName: "Singh",
        email: "john@gmail.com",
        password: "rtyjdfgh",
        _id: "68babc1234567890abcdef12",
    });
    try {
        await user.save();
        res.send('User signed up successfully');
    } catch (error) {
        res.status(400).send('User sign up failed', +error.message);

    }
});


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
