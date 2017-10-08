const avatarUtil = require("./avatar");
const rand = require("./rand");
const uniqid = require('uniqid');
const Avatar = require('../model').Avatar;
const User = require('../model').User;
const Activity = require("../model").Activity;
const ActivityResult = require("../model").ActivityResult;
const WorldEvent = require("../model").WorldEvent;
const Item = require("../model").AvatarItem;
const BattleResults = require("../model").BattleResults;
const ref = require("./reference");
const xp = require("./experience");
const statCalc = require("./statCalc");

const avatarName = function() {
  let first = rand.randomElement(ref.names.first);
  let last = rand.randomElement(ref.names.last);
  return first + " " + last;
};

const emptyAvatar = function() {
  let avatar = new Avatar({_id:uniqid()});
  avatar.name = "TEST";
  //avatar.name = avatarName();
  avatar.skills = [];
  for(let i = 0; i < ref.skills.array.length; ++i) {
    let skill = ref.skills.array[i];
    avatar.skills.push({id:skill.id, level:0, xp:0, xpNext:xp.elementalRequirement(1)})
  }
  return avatarUtil.updateStats(avatar)
};

const basicRealm = function(elementId,level) {
  let realm = {
    level:level,
    elementId:elementId
  };
  return realm;
};

const newUser = function() {
  let user = new User({_id:uniqid()});
  user.avatars.push(emptyAvatar());
  user.currency = 0;
  for(let i = 0; i < ref.elements.length; ++i) {
    user.realms.push({elementId:i,maximumLevel:1})
  }
  return user
};

const baseActivity = function(avatarId,type,initial) {
  let start = Math.floor(Date.now() / 1000);
  let activity = new Activity({_id:uniqid(),avatarId:avatarId,activityType:type,startTimestamp:start});
  activity.calculated = initial;
  return activity
};

const exploreActivity = function(realm,avatarId,initialValues) {
  let activity = baseActivity(avatarId,"explore",initialValues);
  activity.realm = realm;
  return activity
};

const baseActivityResult = function() {
  return new ActivityResult({_id:uniqid(),success:true,realmUnlock:null,currency:0});
};

const baseEvent = function(duration,type) {
  let start = Math.floor(Date.now() / 1000);
  return new WorldEvent({_id:uniqid(),eventType:type,expiry:start+duration})
};

const emptyItem = function(baseItem) {
  let item = new Item({_id:uniqid()});
  item.type = baseItem.type;
  item.refId = baseItem.id;
  item.level = 0;
  item.mods = [];
  return item
};

const emptyBattleResults = function(avatar1,avatar2) {
  return BattleResults({_id:uniqid(),avatar1:avatar1,avatar2:avatar2})
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
  baseActivity,
  baseActivityResult,
  baseEvent,
  emptyBattleResults,
  avatarName
};