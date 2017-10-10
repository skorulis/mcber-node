let mongoose = require('mongoose');

let schema = new mongoose.Schema({
  _id: false,
  id: String,
  quantity:Number

});

module.exports = {
  schema: schema,
  model: mongoose.model('ResourceModel',schema)
};