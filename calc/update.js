//Saves all the data into objects after calculations have been done
const xp = require("./experience")
const avatarCalc = require("./avatar")


const completeActivity = function(activityId,user,avatar,result) {
  user.removeActivity(activityId)
  user.addResource(result.resource)

  xp.addAllExperience(avatar,result.experience)
  avatarCalc.updateStats(avatar) 

  if (result.realmUnlock) {
    var realm = user.findRealm(result.realmUnlock.elementId)
    realm.maximumLevel = Math.max(result.realmUnlock.level,realm.maximumLevel)
  }
  if (result.item) {
    user.items.push(result.item)
  }

  //TODO: Add anything else that comes up
}

module.exports = {
  completeActivity
}