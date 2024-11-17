const mongoose = require('mongoose');

// schema for signup user ------------>
const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    phoneNo : String,
    password : String
});

// model for database connection ------->
module.exports = mongoose.model("users", userSchema)