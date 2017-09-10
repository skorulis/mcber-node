const gen = require("../../calc/generate")
const explore = require("../../calc/explore")

class RequestError extends Error {
    constructor(...args) {
        super(...args)
        this.name = "RequestValidationError"
        Error.captureStackTrace(this, RequestError)
    }
}

const exploreSchema = {
  type:'object',
  required:["realm","avatarId"],
  properties:{
    realm: {
      type:'object',
      required: ['element','level'],
      properties:{
        element:{type:'number'},
        level:{type:'number'}
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
      return next(new RequestError("Avatar is already assigned"))
    }
    var avatar = req.user.findAvatar(req.body.avatarId)
    if (avatar == null) {
      return next(new RequestError("User has no avatar " + req.body.avatarId)) 
    }
    var duration = 30
    var activity = gen.exploreActivity(req.body.realm,req.body.avatarId,duration)
    req.user.activities.push(activity)
    req.user.save().then((user) => {
      res.send({activity:activity})  
    })
  },
  cancel:function(req,res,next) {
    var activity = req.user.findActivity(req.body.activityId)
    if (activity == null) {
      return next(new RequestError("Could not find activity " + activity))
    }
    req.user.removeActivity(req.body.activityId)
    req.user.save().then(user => {
      res.send({activities:user.activities})  
    })
  },
  complete:function(req,res,next) {
    var activity = req.user.findActivity(req.body.activityId)
    if (activity == null) {
      return next(new RequestError("Could not find activity " + req.body.activityId))
    }

    if (!activity.isComplete()) {
      return next(new RequestError("Activity has not completed")) 
    }

    var avatar = req.user.findAvatar(activity.avatarId)
    var result = explore.exploreActivity(activity,avatar)

    req.user.removeActivity(req.body.activityId)


    //TODO: Add resources
    //TODO: Add XP
    //TODO: Add anything else that comes up
    res.send({activities:req.user.activities,result:result})
  }
}