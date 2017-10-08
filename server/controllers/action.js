let gen = require("../../calc/generate");
let exploreCalc = require("../../calc/explore");
let craftCalc = require("../../calc/craft");
let ref = require("../../calc/reference");
let updateCalc = require("../../calc/update");
let util = require("../util/util.js");
let itemCalc = require("../../calc/item");
const validate = require('express-jsonschema').validate;

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
      avatarId: {type:"string"},
      estimateOnly: {type: "bool"}
    }
  }
};

const craftSchema = {
  type:'object',
  required:["itemId","avatarId"],
  properties:{
    itemId: {type:"string"},
    avatarId: {type:"string"},
    estimateOnly: {type: "bool"}
  }
};

const craftGemSchema = {
    type:'object',
    required:["modId","avatarId","level"],
    properties:{
      modId: {type:"string"},
      avatarId: {type:"string"},
      elementId: {type:"string"},
      estimateOnly: {type: "bool"},
      level:{type:'number',multipleOf:1,minimum:1}
    }
};

const socketGemSchema = {
  type:'object',
  required:["gemId","avatarId","itemId"],
  properties:{
    gemId: {type:"string"},
    itemId: {type:"string"},
    avatarId: {type:"string"},
    estimateOnly: {type: "bool"},
  }
};

const cancelCompleteSchema = {
  type:'object',
  required:["activityId"],
  properties:{
    activityId:{type:"string"}
  }
};

let completeActivity = function(activity,avatar,user) {
  if (activity.activityType === "explore") {
    return exploreCalc.completeActivity(activity,avatar);
  } else if (activity.activityType === "craft") {
    return craftCalc.completeActivity(activity,avatar);
  } else if (activity.activityType === "craft gem") {
    return craftCalc.completeGemActivity(activity,avatar);
  } else if (activity.activityType === "socket gem") {
    return craftCalc.completeSocketActivity(activity,avatar,user);
  }
  console.log("DON'T KNOW HOW TO COMPLETE " + activity);
};

let packageAndSave = function(req,res,next) {
  let hasResources = req.user.hasResources(req.activity.calculated.resources);

  if (req.body.estimateOnly) {
    res.send({activity:req.activity,estimate:true,hasResources:hasResources})
  } else {
    if (!hasResources) {
      return next(new util.RequestError("User doesn't have enough resources to craft "));
    }
    req.user.activities.push(req.activity);
    req.user.save().then((user) => {
      res.send({activity:req.activity,estimate:false})
    })
  }
};

let craft = function(req,res,next) {
  let itemRef = ref.baseItems.withId(req.body.itemId);
  if (!itemRef) {
    return next(new util.RequestError("No item with Id" + req.body.itemId));
  }

  req.activity = craftCalc.getActivity(itemRef,req.avatar);
  req.activity.itemId = itemRef.id;
  packageAndSave(req,res,next);
};

let socketGem = function(req,res,next) {
  let item = req.user.removeItem(req.body.itemId);
  if (!item) {
    return next(new util.RequestError("Could not find item " + req.body.itemId));
  }

  let gem = req.user.removeGem(req.body.gemId);
  if (!gem) {
    return next(new util.RequestError("Could not find gem " + req.body.gemId));
  }
  if (!req.body.estimateOnly) {
    req.user.busyGems.push(gem);
    req.user.busyItems.push(item);
  }

  req.activity = craftCalc.getSocketActivity(item,gem,req.avatar);
  packageAndSave(req,res,next);
};

let findAvatar = function(req,res,next) {
  let avatarId = req.body.avatarId;
  if (!req.body.estimateOnly) {
    let currentActivity = req.user.avatarActivity(avatarId);
    if (currentActivity) {
      next(new util.RequestError("Avatar is already assigned"));
      return;
    }
  }

  req.avatar = req.user.findAvatar(avatarId);
  if (!req.avatar) {
    next((new util.RequestError("User has no avatar " + avatarId)));
  } else {
    next()
  }
};

let explore = function(req,res,next) {
  let initial = exploreCalc.initialValues(req.body.realm,req.avatar);
  req.activity = gen.exploreActivity(req.body.realm,req.body.avatarId,initial);
  packageAndSave(req,res,next)
};

let craftGem = function(req,res,next) {
  let modRef = ref.getMod(req.body.modId);
  if (!modRef) {
    return next(new util.RequestError("No mod with id " + req.body.modId));
  }
  let elementRef = null;
  if (req.body.elementId) {
    elementRef = ref.skills.withId(req.body.elementId);
  }

  req.activity = craftCalc.getGemActivity(modRef,req.body.level,elementRef,req.avatar);
  packageAndSave(req,res,next)

};

module.exports = {
  exploreSchema,
  cancelCompleteSchema,
  craftSchema,
  craftGemSchema,
  socketGemSchema,
  explore:[validate({body:exploreSchema}),findAvatar,explore],
  craft:[validate({body:craftSchema}),findAvatar,craft],
  craftGem:[validate({body:craftGemSchema}),findAvatar,craftGem],
  socketGem:[validate({body:socketGemSchema}),findAvatar,socketGem],
  cancel:function(req,res,next) {
    let activity = req.user.findActivity(req.body.activityId);
    if (activity === null) {
      return next(new util.RequestError("Could not find activity " + activity))
    }
    req.user.removeActivity(req.body.activityId);
    req.user.save().then(user => {
      res.send({activities:user.activities})  
    })
  },
  complete:function(req,res,next) {
    let activity = req.user.findActivity(req.body.activityId);
    if (activity === null) {
      return next(new util.RequestError("Could not find activity " + req.body.activityId))
    }

    if (!activity.isComplete()) {
      return next(new util.RequestError("Activity has not completed")) 
    }
    let avatar = req.user.findAvatar(activity.avatarId);
    let result = completeActivity(activity,avatar,req.user);

    updateCalc.completeActivity(req.body.activityId,req.user,avatar,result);

    req.user.save().then(user => {
      res.send({activities:req.user.activities,result:result,avatar:avatar})  
    })

    
    
  }
};