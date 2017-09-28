let gen = require("../../calc/generate");
let explore = require("../../calc/explore");
let craft = require("../../calc/craft");
let ref = require("../../calc/reference");
let updateCalc = require("../../calc/update");
let util = require("../util/util.js");
let itemCalc = require("../../calc/item");

const exploreSchema = {
  type:'object',
  required:["realm","avatarId"],
  properties:{
    realm: {
      type:'object',
      required: ['elementId','level'],
      properties:{
        elementId:{type:'string'},
        level:{type:'number',multipleOf:1,minimum:1}
      },
      avatarId: {type:"string"}
    }
  }
};

const craftSchema = {
  type:'object',
  required:["itemId","avatarId"],
  properties:{
    itemId: {type:"string"},
    avatarId: {type:"string"}
  }
};

const cancelCompleteSchema = {
  type:'object',
  required:["activityId"],
  properties:{
    activityId:{type:"string"}
  }
};

let completeActivity = function(activity,avatar) {
  if (activity.activityType == "explore") {
    return explore.completeActivity(activity,avatar);
  } else if (activity.activityType == "craft") {
    return craft.completeActivity(activity,avatar);
  }
};

let findFreeAvatar = function(user,avatarId,errorBlock) {
    let currentActivity = user.avatarActivity(avatarId);
    if (currentActivity) {
        errorBlock (new util.RequestError("Avatar is already assigned"));
        return;
    }
    let avatar = user.findAvatar(avatarId);
    if (!avatar) {
        errorBlock((new util.RequestError("User has no avatar " + avatarId)));
        return
    }
    return avatar;
};

module.exports = {
  exploreSchema,
  cancelCompleteSchema,
  craftSchema,
  explore:function(req,res,next) {
    let avatar = findFreeAvatar(req.user,req.body.avatarId,next);
    if (!avatar) {
      return
    }

    let initial = explore.initialValues(req.body.realm,avatar);
    let activity = gen.exploreActivity(req.body.realm,req.body.avatarId,initial);
    req.user.activities.push(activity);
    req.user.save().then((user) => {
      res.send({activity:activity})  
    })
  },
  craft:function(req,res,next) {
    let avatar = findFreeAvatar(req.user,req.body.avatarId,next);
    if (!avatar) {
        return
    }
    let itemRef = ref.baseItems.withId(req.body.itemId);
    if (!itemRef) {
      return next(new util.RequestError("No item with Id" + req.body.itemId));
    }
    let resources = itemCalc.requiredResources(itemRef);
    if (!req.user.hasResources(resources)) {
        return next(new util.RequestError("User doesn't have enough resources to craft "));
    }

    let activity = craft.getActivity(itemRef,avatar);
    activity.itemId = itemRef.name;
    req.user.activities.push(activity);
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
    let avatar = req.user.findAvatar(activity.avatarId);
    let result = completeActivity(activity,avatar);

    updateCalc.completeActivity(req.body.activityId,req.user,avatar,result);

    req.user.save().then(user => {
      res.send({activities:req.user.activities,result:result,avatar:avatar})  
    })

    
    
  }
};