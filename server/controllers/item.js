const util = require("../util/util.js")

const assignItemSchema = {
  type:'object',
  required:["avatarId","itemId","slot"],
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
    var item = req.user.removeItem(req.body.itemId)
    if (!item) {
      return next(new util.RequestError("User has no item " + req.body.itemId))   
    }
    var removedItem = avatar.setItem(item,req.body.slot)
    req.user.save().then(user => {
      res.send({avatar:avatar,removedItem:removedItem})
    })
    
  }
}