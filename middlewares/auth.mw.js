/**
 * Create a MW will check the request body is proper and correct
 */
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_config = require("../configs/auth.config")



const verifySignUpBody = async(req, res, next)=>{
    try{
        // Checkfor the name
        if(!req.body.name){
            return res.status(400).send({message : "Failed! Name was not Provided"})
        }
        // Check for the email
        if(!req.body.email){
            return res.status(400).send({message : "Failed! EMail was not Provided"})
        }
        // check for userid
        if(!req.body.userId){
            return res.status(400).send({message : "Failed! UserID was not Provided"})
        }
        // check if the user with the same userid is already present
        const user = await user_model.findOne({userId : req.body.userId})

        if(user){
            return res.status(400).send({message : "Failed! User with same userID already present"})
        }



    }catch(err){
        console.log("Error while validating request",err)
        res.status(500).send({message : "Error while validating request body"})
    }
}


const verifySignInBody = async(req, res, next)=>{
    if(!req.body.userId){
        return res.status(400).send({
            message : "userId is not Provided"
        })
    }

    if(!req.body.password){
        return res.status(400).send({
            message : "Password is not Provided"
        })
    } 
    next()
}

const verifyToken = (req,res,next)=>{
    // check if the token is present in header
    const token = req.headers['x-access-token']

    if(!token){
        return res.status(403).send({
            message : "No token found : UnAuthorized"
        })
    }

    // if it is valid token
    jwt.verify(token,auth_config.secret,async (err,decode)=>{
        if(err){
            return res.send(401).send({
                message : "UnAuthorized !"
            })
        }
        const user = await user_model.findOne({userId : decode.id})

        if(!user){
            return res.status(400).send({
                message:"UnAuthorized, this user for this token doesn't exist"
            })
        }
        // set the user info in the req body
        req.user = user
        // then move to the next step
        next()
    })

    
    
}


const isAdmin = (req,res,next)=>{
    const user = req.user
    if(user && user.userType == "ADMIN"){
        next()
    }else{
        return res.status(403).send({
            message : "Only ADMIN users are allowed to access this endpoint"
        })
    }
}

module.exports = {
    verifySignUpBody : verifySignUpBody,
    verifySignInBody : verifySignInBody,
    verifyToken : verifyToken,
    isAdmin : isAdmin
}
