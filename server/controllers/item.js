const util = require("../util/util.js")
const avatarUtil = require("../../calc/avatar")
const itemCalc = require("../../calc/item")
const ref = require("../../calc/reference")

const assignItemSchema = {
  type:'object',
  required:["avatarId","slot"],
  properties:{
    avatarId: {type:"string"},
    itemId:{type:"string"},
    slot:{type:"string"}
  }
}

const breakdownSchema = {
  type:'object',
  required:["itemId"],
  properties:{
    itemId:{type:"string"}
  }
}

const craftSchema = {
  type:'object',
  required:["itemName"],
  properties:{
    itemName:{type:"string"},
    avatarId:{type:"string"}
  }
}

module.exports = {
  assignItemSchema,
  breakdownSchema,
  craftSchema,
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
    
    var removedItem = avatar.setItem(item,req.body.slot)
    if (removedItem) {
      req.user.items.push(removedItem)
    }
    avatarUtil.updateStats(avatar)

    req.user.save().then(user => {
      res.send({avatar:avatar,removedItem:removedItem})
    })
  },
  breakdownItem:function(req,res,next) {
    var item = req.user.removeItem(req.body.itemId)
    if (!item) {
      return next(new util.RequestError("User has no item " + req.body.itemId))   
    }
    var resources = itemCalc.breakdown(item)
    for (r of resources) {
      req.user.addResource(r)
    }

    req.user.save().then(user => {
      res.send({resources:resources})
    })
  },
  craft:function(req,res,next) {
    var itemRef = ref.baseItems.withId(req.body.itemName)
    if (!itemRef) {
      return next(new util.RequestError("No item named " + req.body.itemName))   
    }
    if (!req.user.hasResources(itemRef.resources)) {
      return next(new util.RequestError("Insufficient resources"))   
    }
    var item = itemCalc.fixedItem(itemRef,[])
    req.user.addItem(item)
    req.user.save().then(user => {
      res.send({item:item,resources:itemRef.resources})
    })
  }
}