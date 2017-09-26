let rand = require("./rand");
let ref = require("./reference");
let xp = require("./experience");
let item = require("./item");
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
    duration: time
  }
};


module.exports = {
  itemSkillAffiliation,
  initialValues
};