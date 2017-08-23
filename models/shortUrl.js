//Template/structure/model of document for shortUrl
//require mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema ({
  originalUrl: String,
  shorterUrl: String
},{timestamps: true});
// table name and schema
const ModelClass = mongoose.model('shortUrl', urlSchema);

module.exports = ModelClass;
