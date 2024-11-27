require('dotenv').config()
const mongoose = require('mongoose');
// connection of nodeJS and mongoDB -------------->
mongoose.connect(`${process.env.MONGO_URL}`)