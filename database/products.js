const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({});

// model for database connection ------->
module.exports = mongoose.model("products", productSchema)