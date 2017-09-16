const avatarUtil = require("./avatar")
const rand = require("./rand")
const uniqid = require('uniqid');
const Avatar = require('../model').Avatar
const User = require('../model').User
const Activity = require("../model").Activity
const ref = require("./reference")
const xp = require("./experience")

const emptyAvatar = function() {
  var avatar = new Avatar({_id:uniqid()})
  avatar.skills.elements = []
  for(var i = 0; i < 10; ++i) {
    avatar.skills.elements.push({level:0,xp:0,xpNext:xp.elementalRequirement(1)})
  }
  return avatarUtil.updateStats(avatar)
}

const basicRealm = function(element,level) {
  var realm = {
    level:level,
    element:element
  }
  return realm;
}

const newUser = function() {
  var user = new User({_id:uniqid()})
  user.avatars.push(emptyAvatar())
  for(var i = 0; i < ref.skills.elements.length; ++i) {
    user.realms.push({elementId:i,maximumLevel:1})
  }
  return user
}

const baseActivity = function(avatarId,type) {
  return new Activity({_id:uniqid(),avatarId:avatarId,activityType:type})
}

const exploreActivity = function(realm,avatarId,duration) {
  var activity = baseActivity(avatarId,"explore")
  activity.realm = realm
  activity.finishTimestamp = activity.startTimestamp + duration
  return activity
}

module.exports = {
  emptyAvatar:emptyAvatar,
  withLevels:function(elements) {
    var avatar = emptyAvatar()
    avatar.skills.elements = []
    for(var i = 0; i < elements.length; ++i) {
      avatar.skills.elements.push({level:elements[i],xp:0,xpNext:xp.elementalRequirement(elements[i]+1)})
    }
    return avatarUtil.updateStats(avatar)
  },
  randomAvatar:function(level) {
    var avatar = emptyAvatar();
    while(level > 0) {
      const index = rand.getRandomInt(0,9)
      const value = rand.getRandomInt(1,level)
      avatar.skills.elements[index].level += value
      level -= value 
    }
    avatarUtil.updateStats(avatar)
    return avatar
  },
  basicRealm,
  newUser,
  exploreActivity
}