let util = require("../util/util.js");

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


module.exports = {
  buyAvatarSlot


};