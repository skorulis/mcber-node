const avatarUtil = require("./avatar")
const rand = require("./rand")
const uniqid = require('uniqid'); 

const emptyAvatar = function() {
  var avatar = {}
  avatar.id = uniqid()
  avatar.skills = {
    elements:Array.apply(null, Array(10)).map(Number.prototype.valueOf,0)
  }
  return avatarUtil.updateStats(avatar)
}

const basicRealm = function(element,level) {
  var realm = {
    level:level,
    element:element
  }
  return realm;
}

module.exports = {
  emptyAvatar:emptyAvatar,
  withLevels:function(elements) {
    var avatar = emptyAvatar()
    avatar.skills.elements = elements
    return avatarUtil.updateStats(avatar)
  },
  randomAvatar:function(level) {
    var avatar = emptyAvatar();
    while(level > 0) {
      const index = rand.getRandomInt(0,9)
      const value = rand.getRandomInt(1,level)
      avatar.skills.elements[index] += value
      level -= value 
    }
    avatarUtil.updateStats(avatar)
    return avatar
  },
  basicRealm
}