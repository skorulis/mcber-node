const avatarUtil = require("./avatar");
const rand = require("./rand");
const uniqid = require('uniqid');
const Avatar = require('../model').Avatar;
const User = require('../model').User;
const Activity = require("../model").Activity;
const Item = require("../model").AvatarItem;
const ref = require("./reference");
const xp = require("./experience");
const statCalc = require("./statCalc");

const emptyAvatar = function() {
  let avatar = new Avatar({_id:uniqid()});
  avatar.skills = [];
  for(let i = 0; i < ref.skills.array.length; ++i) {
    let skill = ref.skills.array[i];
    avatar.skills.push({id:skill.id, level:0, xp:0, xpNext:xp.elementalRequirement(1)})
  }
  return avatarUtil.updateStats(avatar)
};

const basicRealm = function(elementId,level) {
  var realm = {
    level:level,
    elementId:elementId
  }
  return realm;
}

const newUser = function() {
  var user = new User({_id:uniqid()})
  user.avatars.push(emptyAvatar())
  for(var i = 0; i < ref.elements.length; ++i) {
    user.realms.push({elementId:i,maximumLevel:1})
  }
  return user
}

const baseActivity = function(avatarId,type,initial) {
  let start = Math.floor(Date.now() / 1000);
  let activity = new Activity({_id:uniqid(),avatarId:avatarId,activityType:type,startTimestamp:start});
  activity.calculated = initial;
  return activity
};

const exploreActivity = function(realm,avatarId,initialValues) {
  var activity = baseActivity(avatarId,"explore",initialValues)
  activity.realm = realm
  return activity
}

const emptyItem = function(baseItem) {
  let item = new Item({_id:uniqid()});
  item.type = baseItem.type;
  item.name = baseItem.name;
  item.mods = [];
  return item
};

module.exports = {
  emptyAvatar:emptyAvatar,
  withLevels:function(elements) {
    let avatar = emptyAvatar();
    for(let i = 0; i < elements.length; ++i) {
      avatar.skills[i].level = elements[i];
      avatar.skills[i].xpNext = xp.elementalRequirement(elements[i]+1)
    }
    return avatarUtil.updateStats(avatar)
  },
  randomAvatar:function(level) {
    let avatar = emptyAvatar();
    while(level > 0) {
      const index = rand.getRandomInt(0,9);
      const value = rand.getRandomInt(1,level);
      avatar.skills[index].level += value;
      level -= value 
    }
    avatarUtil.updateStats(avatar);
    return avatar
  },
  basicRealm,
  newUser,
  exploreActivity,
  emptyItem,
  baseActivity
};