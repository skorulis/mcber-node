const avatarUtil = require("./avatar")

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const emptyAvatar = function() {
  var avatar = {}
  avatar.skills = Array.apply(null, Array(10)).map(Number.prototype.valueOf,0);
  return avatarUtil.updateStats(avatar)
}

module.exports = {
  emptyAvatar:emptyAvatar,
  withLevels:function(skills) {
    var avatar = emptyAvatar()
    avatar.skills = skills
    return avatarUtil.updateStats(avatar)
  },
  randomAvatar:function(level) {
    var avatar = emptyAvatar();
    while(level > 0) {
      const index = getRandomInt(0,9)
      const value = getRandomInt(1,level)
      avatar.skills[index] += value
      level -= value 
    }
    avatarUtil.updateStats(avatar)
    return avatar
  }
}