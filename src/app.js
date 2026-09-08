const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post('/signUp',async (req,res)=>{
    const user = new User(req.body);
    try {
        await user.save();
        res.send('User signed up successfully');
    } catch (error) {
        res.status(500).send('Error signing up the user'+error.message); 
    }
});
//can use find() if we want to find multiple user with same email id or any other data.
app.get('/getUser',async (req,res)=>{
    const userEmail = req.body.email;
    try {
        console.log("This is the email you entered:-"+userEmail);
        const user = await User.findOne({email : userEmail});
        if(!user){
            res.status(404).send('User not found');
        }
        else{
            res.send(user);
            console.log(user);
        }
    } catch (error) {
        res.status(500).send('Some trouble arrived finding the user');
    }
});

app.get('/allUser',async (req,res)=>{
    try {
        const users = await User.find({});
        res.send(users);
        console.log(users);
    } catch (error) {
        res.status(404).send('No users found!!!');
    }
});

app.delete('/delUser',async (req,res)=>{
    const userId = req.body.Id;
    try {
        const user = await User.findByIdAndDelete(userId); 
      //const user = await User.findByIdAndDelete({_id:userId});
        if(!user){
            res.status(404).send('No such users exist');
        }
        else{
            res.send('User deleted successfully');
        }
    } catch (error) {
        res.status(500).send("Error deleting user");
    }
});

app.patch('/update',async (req,res)=>{
    const userId = req.body.Id;
    const userData = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId,userData);
        if(!user){
            res.status(404).send('No such user exist');
        }
        else{
            res.send('User updated successfully');
            console.log(user);
        }
    } catch (error) {
        res.status(500).send('Error updating the user');
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
