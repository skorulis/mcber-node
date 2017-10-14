let rand = require("./rand");
let ref = require("./reference");
let xp = require("./experience");
let itemCalc = require("./itemCalc");
let gen = require("./generate");
let update = require("./update");
let Counter = require("../util/Counter");
let ResourceContainer = require("../util/ResourceContainer");

let kCraftSkill = "102";


let initialValues = function(itemRef,avatar) {
  let resources = new ResourceContainer(itemRef.resources,ref.resources,ref.skills,null,1);
  let itemSkill = resources.skillAffiliation();
  let skill = avatar.stats.skill(itemSkill.id);
  skill += avatar.stats.skill(kCraftSkill);

  let time = 10 * Math.pow(resources.totalCost(),1.2) / (skill + 1);
  let initial = gen.baseActivityCalculation(time);
  initial.skillLevel = skill;
  initial.usedSkills =[itemSkill.id,kCraftSkill];
  initial.resources = resources.adjustedList;
  return initial;
};

let initialGemValues = function(modRef,level,elementRef,avatar) {
  let resources = itemCalc.gemRefResources(modRef,level,elementRef);
  let usedSkill = resources.skillAffiliation();
  let skill = avatar.stats.skill(kCraftSkill) + avatar.stats.skill(usedSkill.id);
  let time = 10 * Math.pow(resources.totalCost(),1.2) / (skill + 1);
  let initial = gen.baseActivityCalculation(time);
  initial.skillLevel = skill;
  initial.usedSkills =[usedSkill.id,kCraftSkill];
  initial.resources = resources.adjustedList;
  return initial;
};

let initialSocketValues = function(item,gem,avatar) {
  let gemResources = itemCalc.gemResources(gem);
  let usedSkill = gemResources.skillAffiliation();
  let skill = avatar.stats.skill(kCraftSkill) + avatar.stats.skill(usedSkill.id);
  let difficulty = Math.round(Math.pow(item.level + gem.power + item.mods.length,1.5));
  let failure = Math.min(difficulty / (skill + 1),1);
  let time = (30 * difficulty) / (skill + 1);
  let initial = gen.baseActivityCalculation(time);
  initial.skillLevel = skill;
  initial.usedSkills =[usedSkill.id,kCraftSkill];
  initial.failureChance = failure;
  return initial;
};

let getResult = function(itemRef,avatar,initial) {
  let result = gen.baseActivityResult();
  result.experience = xp.craftGain(initial);
  result.item = itemCalc.fixedItem(itemRef,[]);

  return result;
};

let getGemResult = function(modRef,level,elementRef,avatar,initial) {
  let result = gen.baseActivityResult();
  result.experience = xp.craftGain(initial);
  let elementId = elementRef ? elementRef.id : null;
  result.gem = itemCalc.fixedMod(modRef,level,elementId);
  return result;
};

let getSocketResult = function(item,gem,initial) {
  let result = gen.baseActivityResult();
  result.experience = xp.craftGain(initial);
  if (rand.randomDouble() > initial.failureChance) {
    item.mods.push(gem)
  } else {
    result.success = false;
  }
  result.item = update.updateItem(item);
  return result;
};

let getActivity = function(itemRef,avatar) {
  let initial = initialValues(itemRef,avatar);
  let activity = gen.baseActivity(avatar._id,"craft",initial);
  activity.itemId = itemRef.id;
  return activity
};

let getGemActivity = function(modRef,level,elementRef,avatar) {
  let initial = initialGemValues(modRef,level,elementRef,avatar);
  let activity = gen.baseActivity(avatar._id,"craft gem",initial);
  let elementId = elementRef ? elementRef.id : null;
  activity.gem = {elementId:elementId,level:level,modId:modRef.id};
  return activity;
};

let getSocketActivity = function(item,gem,avatar) {
  let initial = initialSocketValues(item,gem,avatar);
  let activity = gen.baseActivity(avatar._id,"socket gem",initial);
  activity.socketGem = {itemId:item._id,gemId:gem._id};
  return activity;
};

let completeActivity = function(activity,avatar) {
  let itemRef = ref.baseItems.withId(activity.itemId);
  let result = getResult(itemRef,avatar,activity.calculated);
  return result
};

let completeGemActivity = function(activity,avatar) {
  let modRef = ref.mods.withId(activity.gem.modId);
  let elementRef = ref.skills.withId(activity.gem.elementId);
  let result = getGemResult(modRef,activity.gem.level,elementRef,avatar,activity.calculated);
  return result
};

let completeSocketActivity = function(activity,avatar,user) {
  let item = user.removeBusyItem(activity.socketGem.itemId);
  let gem = user.removeBusyGem(activity.socketGem.gemId);
  let result = getSocketResult(item,gem,activity.calculated);
  return result;
};

module.exports = {
  initialValues,
  initialGemValues,
  initialSocketValues,
  getResult,
  getGemResult,
  getSocketResult,
  getActivity,
  getGemActivity,
  getSocketActivity,
  completeActivity,
  completeGemActivity,
  completeSocketActivity
};