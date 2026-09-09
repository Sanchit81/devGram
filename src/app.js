const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUp } = require('./utils/validate');
const bcrypt = require('bcrypt');
const user = require('./models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());

app.post('/signUp', async (req, res) => {
    //const user = new User(req.body)
    try {
        validateSignUp(req);
        const { firstName, lastName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })
        await user.save();
        res.send('User signed up successfully');
    } catch (error) {
        res.status(500).send('Error signing up the user' + error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if (!user) {
            throw new Error('Invalid Credentials!!');
        }

        const isPassValid = await bcrypt.compare(password, user.password);
        if (isPassValid) {
            const token = await jwt.sign({_id:user._id},"dkggjif5675gdf");
            res.cookie("token",token);
            res.send("Login successfull!!");
        } else {
            throw new Error("Invalid Credentials!!");
        }
    } catch (error) {
        res.status(501).send('User login failed!!' +error.message);
    }
});

app.get('/profile',async (req,res)=>{
    const cookies = req.cookies;
    const {token} = cookies;

    try {
        if(!token){
        throw new Error('Invalid Token!!');
    }

    const decode = await jwt.verify(token,"dkggjif5675gdf");

    const {_id} = decode;

    const user = await User.findById({_id});
    if(!user){
        throw new Error('User does not exist!!');
    }

    res.send(user);
    } catch (error) {
        res.status(500).send("Can't access profile" +error.message);
    }
});

//can use find() if we want to find multiple user with same email id or any other data.
app.get('/getUser', async (req, res) => {
    const userEmail = req.body.email;
    try {
        console.log("This is the email you entered:-" + userEmail);
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            res.status(404).send('User not found');
        }
        else {
            res.send(user);
            console.log(user);
        }
    } catch (error) {
        res.status(500).send('Some trouble arrived finding the user');
    }
});

app.get('/allUser', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
        console.log(users);
    } catch (error) {
        res.status(404).send('No users found!!!');
    }
});

app.delete('/delUser', async (req, res) => {
    const userId = req.body.Id;
    try {
        const user = await User.findByIdAndDelete(userId);
        //const user = await User.findByIdAndDelete({_id:userId});
        if (!user) {
            res.status(404).send('No such users exist');
        }
        else {
            res.send('User deleted successfully');
        }
    } catch (error) {
        res.status(500).send("Error deleting user");
    }
});

app.patch('/update/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const userData = req.body;
    try {
        const ALLOWED_TO_UPDATE = ["photoURL", "about", "age", "skills"];
        const isUpdateAllowed = Object.keys(userData).every((k) =>
            ALLOWED_TO_UPDATE.includes(k));
        if (!isUpdateAllowed) {
            throw new Error('Update not allowed');
        }

        if (userData.skills?.length > 10) {
            throw new Error("Skills cannot be more than 10!!");
        }

        const user = await User.findByIdAndUpdate(userId, userData);
        if (!user) {
            res.status(404).send('No such user exist');
        }
        else {
            res.send('User updated successfully');
            console.log(user);
        }
    } catch (error) {
        res.status(500).send('Error updating the user' + error.message);
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
