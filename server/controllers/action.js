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

const cancelCompleteSchema = {
  type:'object',
  required:["activityId"],
  properties:{
    activityId:{type:"string"}
  }
};

let completeActivity = function(activity,avatar) {
  if (activity.activityType === "explore") {
    return explore.completeActivity(activity,avatar);
  } else if (activity.activityType === "craft") {
    return craft.completeActivity(activity,avatar);
  } else if (activity.activityType === "craft gem") {
    return craft.completeGemActivity(activity,avatar);
  }
  console.log("DON'T KNOW HOW TO COMPLETE " + activity);
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

module.exports = {
  exploreSchema,
  cancelCompleteSchema,
  craftSchema,
  craftGemSchema,
  explore:function(req,res,next) {
    let avatar = findFreeAvatar(req.user,req.body.avatarId,next);
    if (!avatar) {
      return
    }

    let initial = explore.initialValues(req.body.realm,avatar);
    req.activity = gen.exploreActivity(req.body.realm,req.body.avatarId,initial);
    packageAndSave(req,res,next)
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

    req.activity = craft.getActivity(itemRef,avatar);
    req.activity.itemId = itemRef.name;
    packageAndSave(req,res,next);
  },
  craftGem:function(req,res,next) {
    let avatar = findFreeAvatar(req.user,req.body.avatarId,next);
    if (!avatar) {
      return
    }
    let modRef = ref.getMod(req.body.modId);
    if (!modRef) {
      return next(new util.RequestError("No mod with id " + req.body.modId));
    }
    let elementRef = null;
    if (req.body.elementId) {
      elementRef = ref.skills.withId(req.body.elementId);
    }

    console.log(req.body.level);

    req.activity = craft.getGemActivity(modRef,req.body.level,elementRef,avatar);
    req.activity.gem = {modId:modRef.id,elementId:req.body.elementId,level:req.body.level};
    packageAndSave(req,res,next)

  },
  cancel:function(req,res,next) {
    let activity = req.user.findActivity(req.body.activityId);
    if (activity == null) {
      return next(new util.RequestError("Could not find activity " + activity))
    }
    req.user.removeActivity(req.body.activityId);
    req.user.save().then(user => {
      res.send({activities:user.activities})  
    })
  },
  complete:function(req,res,next) {
    let activity = req.user.findActivity(req.body.activityId)
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