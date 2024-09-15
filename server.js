/**
 * This will be the starting file of the Project
 */

const express = require("express")
const mongoose = require("mongoose")

const app = express()
const server_config = require("./configs/server.config")
const db_config = require("./configs/db.config")
const user_model = require("./models/user.model")
const bcrypt = require("bcryptjs")

// MIDDLEWARE - convert JSON to JS object
app.use(express.json())


/**
 * Create and admin user at the starting of the apllication
 * if not already present
 */ 
// Connection with mongoDB
mongoose.connect(db_config.DB_URL)
const db = mongoose.connection
db.on("error",()=>{
    console.log("Error while Connecting to the MongoDB")
})
db.once("open",()=>{
    console.log("Connected to MongoDB")
    init()
})

async function init(){
    try{
        let user = await user_model.findOne({userId : "admin"})

        if(user){
            console.log("Admin is already present")
            return
        }
    }catch(err){
        console.log("Error while reading the Data",err)
    }
    

    

//     try{
//         user = await user_model.create({
//             name : "Avtar",
//             userId : "admin",
//             email : "avtar@gmail.com",
//             userType : "ADMIN",
//             password : bcrypt.hashSync("Welcome1",8)
//         })
//         console.log("Admin Created", user)

//     }catch(err){
//         console.log("Error while creating admin", err)
//     }
// }


/**
 * stich the route to the server
 */

require("./routes/auth.route")(app)
require("./routes/category.route")(app)

/**
 * Start the server
 */

app.listen(server_config.PORT, ()=>{
    console.log("Server Started at port number : ",server_config.PORT)
})
}