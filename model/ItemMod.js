let mongoose = require('mongoose');
let config = require("../server/config/config");

let schema = new mongoose.Schema({
    _id: String,
    refId: String,
    power:Number, //Level
    elementId:String

});

module.exports = {
    schema: schema,
    model: mongoose.model('ItemMod',schema)
};