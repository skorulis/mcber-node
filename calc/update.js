//Saves all the data into objects after calculations have been done
let xp = require("./experience");
let avatarCalc = require("./avatar");
let itemCalc = require("./item");

const completeActivity = function(activityId,user,avatar,result) {
  if (activityId) {
    user.removeActivity(activityId);
  }

  if (result.item) {
    if (user.getOption("item auto squelch level",-1) >= result.item.level) {
      let resContainer = itemCalc.breakdown(result.item);
      resContainer.addArray(result.resources);
      result.resources = resContainer.adjustedList;
      result.item = null;

    } else {
      user.items.push(result.item)
    }
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

  if (result.gem) {
    user.gems.push(result.gem);
  }
  if (result.foundAvatar && user.avatars.length < user.maxAvatars) {
    user.avatars.push(result.foundAvatar);
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