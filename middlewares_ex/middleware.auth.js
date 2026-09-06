const adminAuth = (req,res,next)=>{
    console.log("authenticating admin");
    const token = 'xyz';
    const admintoken = token === 'xyz';
    if(!admintoken){
        res.status(401).send("admin not aurthorized");
    }
    else{
        next()
    }
};

const userAuth = (req,res,next)=>{
    console.log("authenticating user");
    const token = 'xyz';
    const usertoken = token === 'xyz';
    if(!usertoken){
        res.status(401).send("user not authorized");
    }
    else{
        next()
    }
};

module.exports = {userAuth,adminAuth};