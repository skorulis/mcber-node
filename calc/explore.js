const rand = require("./rand");
const ref = require("./reference");
const xp = require("./experience");
const item = require("./itemCalc");
const gen = require("./generate");
const common = require("./activityCommon");
const squelch = require("./squelch");

let kExploreSkill = "104";

const initialValues = function(realm,avatar) {
  let skill = avatar.stats.skill(realm.elementId);
  skill += avatar.stats.skill(kExploreSkill);
  let time = 30 * realm.level * realm.level / (skill + 1);
  let initial = gen.baseActivityCalculation(time);
  initial.difficulty = Math.pow(realm.level,2);
  initial.skillLevel = skill;
  initial.usedSkills = [realm.elementId,kExploreSkill];
  initial.failureChance = common.failureRate(skill,initial.difficulty);
  return initial;
};

const chooseResource = function(realm,avatar) {
  let skill = ref.getSkill(realm.elementId);
  return skill.resources[0]
};

const calculateResourceQuantity = function(realm,avatar,resource) {
  let rarity = resource.rarity || 1;
  return Math.round(Math.pow(realm.level,1.5) / rarity)
};

const getExploreResult = function(realm,avatar,initial) {
  let result = common.activityResult(initial);
  if (!result.success) {
    return result;
  }
  let maxCurrency = Math.round(Math.pow(realm.level,1.1));
  result.experience = xp.exploreGain(realm, initial.duration);
  result.currency = rand.getRandomInt(0,maxCurrency,"findCurrency");
  let resource = chooseResource(realm,avatar);
  let quantity = calculateResourceQuantity(realm,avatar,resource);
  result.resources = [{id:resource.id,quantity:quantity}];
  if (rand.getRandomInt(0,100,"realmUnlock") > 90) { //10% chance to unlock a realm)
    result.realmUnlock = {elementId:realm.elementId,level:realm.level + 1}
  }
  if (rand.makesChance(90,"findGemOrItem")) { //10% chance of getting an item or mod
    let maxPower = realm.level;
    maxPower = maxPower * 2;
    if (rand.makesChance(50,"gemOrItem")) {
      result.item = item.randomItem(maxPower,realm.elementId)
    } else {
      result.gem = item.randomGem(maxPower,realm.elementId);
    }
  }
  if(rand.randomDouble("findAvatar") > 0.99) {
    let level = rand.getRandomInt(realm.level*3,realm.level*10);
    result.foundAvatar = gen.randomAvatar(level);
  }

  return result
};

const completeActivity = function(activity,avatar,user) {
  let result = getExploreResult(activity.realm,avatar,activity.calculated);
  squelch.squelchResult(user,result);
  return result;
};

module.exports = {
  initialValues,
  chooseResource,
  calculateResourceQuantity,
  completeActivity,
  getExploreResult
};