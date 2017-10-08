//Saves all the data into objects after calculations have been done
let xp = require("./experience");
let avatarCalc = require("./avatar");

const completeActivity = function(activityId,user,avatar,result) {
  if (activityId) {
    user.removeActivity(activityId);
  }

  for (let res of result.resources) {
    user.addResource(res);
  }

  xp.addAllExperience(avatar,result.experience);
  avatarCalc.updateStats(avatar);

  if (result.realmUnlock) {
    let realm = user.findRealm(result.realmUnlock.elementId);
    realm.maximumLevel = Math.max(result.realmUnlock.level,realm.maximumLevel);
  }
  if (result.item) {
    user.items.push(result.item)
  }
  if (result.gem) {
    user.gems.push(result.gem);
  }
  user.currency = user.currency + result.currency;

  //TODO: Add anything else that comes up
};

const updateItem = function(item) {
  let level = 0;
  for (gem of item.mods) {
    level = level + gem.power;
  }
  item.level = level;
  return item;
};

module.exports = {
  completeActivity,
  updateItem
};