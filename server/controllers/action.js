const gen = require("../../calc/generate")
const explore = require("../../calc/explore")
const xp = require("../../calc/experience")
const avatarCalc = require("../../calc/avatar")
const updateCalc = require("../../calc/update")
const util = require("../util/util.js")

const exploreSchema = {
  type:'object',
  required:["realm","avatarId"],
  properties:{
    realm: {
      type:'object',
      required: ['elementId','level'],
      properties:{
        elementId:{type:'number'},
        level:{type:'number',multipleOf:1,minimum:1}
      },
      avatarId: {type:"string"}
    }
  }
}

const cancelCompleteSchema = {
  type:'object',
  required:["activityId"],
  properties:{
    activityId:{type:"string"}
  }
}

module.exports = {
  exploreSchema,
  cancelCompleteSchema,
  explore:function(req,res,next) {
    var currentActivity = req.user.avatarActivity(req.body.avatarId)
    if (currentActivity != null) {
      return next(new util.RequestError("Avatar is already assigned"))
    }
    var avatar = req.user.findAvatar(req.body.avatarId)
    if (avatar == null) {
      return next(new util.RequestError("User has no avatar " + req.body.avatarId)) 
    }
    var duration = 30
    var initial = explore.initialValues(req.body.realm,avatar)
    var activity = gen.exploreActivity(req.body.realm,req.body.avatarId,initial)
    req.user.activities.push(activity)
    req.user.save().then((user) => {
      res.send({activity:activity})  
    })
  },
  cancel:function(req,res,next) {
    var activity = req.user.findActivity(req.body.activityId)
    if (activity == null) {
      return next(new util.RequestError("Could not find activity " + activity))
    }
    req.user.removeActivity(req.body.activityId)
    req.user.save().then(user => {
      res.send({activities:user.activities})  
    })
  },
  complete:function(req,res,next) {
    var activity = req.user.findActivity(req.body.activityId)
    if (activity == null) {
      return next(new util.RequestError("Could not find activity " + req.body.activityId))
    }

    if (!activity.isComplete()) {
      return next(new util.RequestError("Activity has not completed")) 
    }
    var avatar = req.user.findAvatar(activity.avatarId)
    var result = explore.completeActivity(activity,avatar)

    updateCalc.completeActivity(req.body.activityId,req.user,avatar,result)

    req.user.save().then(user => {
      res.send({activities:req.user.activities,result:result,avatar:avatar})  
    })

    
    
  }
}