const mongoose = require('mongoose');
//const { Schema } = mongoose;

const urlSchema = new mongoose.Schema({
originalUrl:{type: String, required: true},
shortUrl:{type: String, required: true, unique: true},
createdAt:{type:Date, default:Date.now}
})
const URL = mongoose.model('URL', urlSchema);

module.exports = URL;