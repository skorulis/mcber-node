let util = require("../util/util.js");
const validate = require('express-jsonschema').validate;

const setOptionsSchema = {
  type:'object',
  required:"options",
  properties:{
    options:{
      type:"array",
      items:{
        type:"object",
        required:["optionName"],
        properties:{
          optionName:{type:"string"},
          optionValue:{type:["string","integer"]},
        }
      }
    }
  }
};

const buyAvatarSlot = function (req,res,next) {
  let cost = Math.pow(10, req.user.maxAvatars-1);
  if (req.user.currency < cost) {
    return next(new util.RequestError("Insufficient currency for purchase (" + cost + ")"));
  }
  req.user.currency -= cost;
  req.user.maxAvatars += 1;

  req.user.save().then((user) => {
    res.send({user:user})
  });

};

const setOptions = function (req, res, next) {
  for (let opt of req.body.options) {
    req.user.setOption(opt.optionName,opt.optionValue)
  }

  req.user.save().then((user) => {
    res.send({"user":req.user})
  });
};


module.exports = {
  buyAvatarSlot,
  setOptions:[validate({body:setOptionsSchema}),setOptions]

};