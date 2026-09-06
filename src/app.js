const express = require('express')

const app = express()
const {adminAuth,userAuth} = require('../middlewares_ex/middleware.auth');
//this will match all the HTTP method API calls to /
app.use('/',(req,res)=>{
    res.send("Hello hello.....hel....");
})

// //this will match all the HTTP method API calls to /test
app.use('/test',(req,res)=>{
    res.send("Hello to from tes...t");
})

app.use((req,res)=>{
    res.send("Hello from the server");
})

//this will handle all GET req at home
app.get('/home',(req,res)=>{
    res.send("halo halo halo");
})

app.listen(3000,()=> {
    console.log("Server successfully listening at port 3000...")
})
//Note: order of api routes in which they are written matters


//multiple route handlers
// app.use('/route',rh1,rh2,rh3,rh4);
// app.use('/route',[rh1,rh2,rh3,rh4]);
// app.use('/route',rh1,[rh2,rh3],rh4);
// app.use('/route',rh1,[rh2],rh3,rh4);

app.get('/home',(req,res,next)=>{
    //res.send("hello 1st handler");
    console.log("hello from 1st handler");
    next()
},
(req,res,next)=>{
    console.log("hello from 2nd handler");
    //res.send("hello 2nd handler");
    console.log("hello 2nd handler");
    next()
},
(req,res,next)=>{
    res.send("hello from 3rd handler")
    console.log("hello 3rd handler");
    next()
})

// Now in general all these handlers at the middle are exactly what are known as middlewares.
// And the handler that actually handles a particular route and sends back a response to the 
// client is known as route handler.

app.use('/admin',adminAuth);  //miidleware

app.get('/admin/getdata',(req,res)=>{
    res.send("retreived all data");
});

app.get('/admin/deleteAdmin',(req,res)=>{
    res.send("admin deleted");
});

app.post('/user/login',(req,res)=>{
    res.send('user logged in successfully');
});


app.get('/user/getdata',userAuth,(req,res)=>{
    // do your required functionality
    //try {
    throw new Error('sfghjhgf');
    res.send('got user data');
    //} catch (error) {
    console.log('logging from inside try n catch');
    res.status(501).send('something wrong occured,contact support team');
    //}
});

// This will error handler will handle certain errors that may sometimes arise in our program 
// be for any routes and show the error in a graceful way. Always place this error handler at 
// the bottom of all your different routes.
app.use('/',(err,req,res,next)=>{
    //log ur error
    console.log('inside error handler');
    console.log(err.message);
    res.status(501).send('something wrong occured,contact support team');
});