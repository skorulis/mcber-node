let rand = require("./rand");
let ref = require("./reference");
let xp = require("./experience");
let item = require("./item");
let gen = require("./generate");
let Counter = require("../util/Counter");

let kCraftSkill = "102";

let itemSkillAffiliation = function(itemRef) {
  let counts = new Counter();
  for (r of itemRef.resources) {
    let resourceRef = ref.resources.withId(r.id);
    counts.add(resourceRef.skill,r.quantity)
  }
  let skillId = counts.maxValue().key;
  return ref.getSkill(skillId)
};

let itemResourceCost = function(itemRef) {
  let total = 0;
  for (r of itemRef.resources) {
    let resourceRef = ref.resources.withId(r.id);
    total += r.quantity * resourceRef.rarity
  }
  return total;
};

let initialValues = function(itemRef,avatar) {
  let itemSkill = itemSkillAffiliation(itemRef);
  let skill = avatar.stats.skill(itemSkill.id);
  skill += avatar.stats.skill(kCraftSkill);
  let resCost = itemResourceCost(itemRef);
  let time = 10 * Math.pow(resCost,1.2) / (skill + 1);
  time = Math.max(Math.round(time),2);
  return {
    skillLevel:skill,
    duration: time,
    usedSkills:[itemSkill.id,kCraftSkill]
  }
};

let getResult = function(itemRef,avatar,initial) {
  let result = {};
  result.experience = xp.craftGain(itemRef,initial);
  result.item = item.fixedItem(itemRef,[]);

  return result;
};

let getActivity = function(itemRef,avatar) {
  let initial = initialValues(itemRef,avatar);
  let activitiy = gen.baseActivity(avatar._id,"craft",initial);
  activitiy.itemId = itemRef.name;
  return activitiy
};

let completeActivity = function(activity,avatar) {
  let itemRef = ref.baseItems.withId(activity.itemId);
  let result = getResult(itemRef,avatar,activity.calculated);
  return result
};

module.exports = {
  itemSkillAffiliation,
  initialValues,
  getResult,
  getActivity,
  completeActivity
};