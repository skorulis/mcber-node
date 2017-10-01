const util = require("../util/util.js");
const avatarUtil = require("../../calc/avatar");
const itemCalc = require("../../calc/item");
const ref = require("../../calc/reference");

let assignItemSchema = {
  type:'object',
  required:["avatarId","slot"],
  properties:{
    avatarId: {type:"string"},
    itemId:{type:"string"},
    slot:{type:"string"}
  }
};

let breakdownSchema = {
  type:'object',
  required:["itemId"],
  properties:{
    itemId:{type:"string"}
  }
};

let breakdownGemSchema = {
  type:'object',
  required:["gemId"],
  properties:{
    itemId:{type:"string"}
  }
};

module.exports = {
  assignItemSchema,
  breakdownSchema,
  breakdownGemSchema,
  assignItem:function(req,res,next) {
    var avatar = req.user.findAvatar(req.body.avatarId)
    if (!avatar) {
      return next(new util.RequestError("User has no avatar " + req.body.avatarId))  
    }
    var item = null;
    if (req.body.itemId) {
      item = req.user.removeItem(req.body.itemId)
      if (!item) {
        return next(new util.RequestError("User has no item " + req.body.itemId))   
      }  
    }
    
    let removedItem = avatar.setItem(item,req.body.slot);
    if (removedItem) {
      req.user.items.push(removedItem)
    }
    avatarUtil.updateStats(avatar);

    req.user.save().then(user => {
      res.send({avatar:avatar,removedItem:removedItem})
    })
  },
  breakdownItem:function(req,res,next) {
    let item = req.user.removeItem(req.body.itemId);
    if (!item) {
      return next(new util.RequestError("User has no item " + req.body.itemId))   
    }
    let resources = itemCalc.breakdown(item);
    for (r of resources) {
      req.user.addResource(r)
    }

    req.user.save().then(user => {
      res.send({resources:resources})
    })
  },
  breakdownGem:function(req,res,next) {
    let gem = req.user.removeGem(req.body.gemId);
    if (!gem) {
      return next(new util.RequestError("User has no Gem " + req.body.gemId))
    }
    let resources = itemCalc.breakdownGem(gem);
    for (r of resources) {
      req.user.addResource(r)
    }

    req.user.save().then(user => {
      res.send({resources:resources})
    })
  }
};