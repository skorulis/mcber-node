const rand = require("./rand");
const ref = require("./reference");
const xp = require("./experience");
const item = require("./item");
let Counter = require("../util/Counter");

const kCraftSkill = 102;

const itemSkillAffiliation = function(itemRef) {
  let counts = new Counter();
  for (r of itemRef.resources) {
    let resourceRef = ref.resources.withId(r.id);
    counts.add(resourceRef.skill,r.quantity)
  }
  let skillId = counts.maxValue().key;
  return ref.getSkill(skillId)
};

const initialValues = function(itemRef,avatar) {
  var skill = avatar.stats.skill(realm.elementId);
  skill += avatar.stats.skill(kExploreSkill);
  var time = 30 * realm.level * realm.level / (skill + 1);
  time = Math.max(time,2);
  return {
    skillLevel:skill,
    duration: time
  }
};


module.exports = {
  itemSkillAffiliation,
  initialValues
};