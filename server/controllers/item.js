const util = require("../util/util.js")
const avatarUtil = require("../../calc/avatar")

const assignItemSchema = {
  type:'object',
  required:["avatarId","slot"],
  properties:{
    avatarId: {type:"string"},
    itemId:{type:"string"},
    slot:{type:"string"}
  }
}


module.exports = {
  assignItemSchema,
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
    
  }
}