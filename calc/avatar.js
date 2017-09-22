const ref = require("./reference")
const statCalc = require("./statCalc")

module.exports = {
  updateStats:function(avatar) {
    avatar.stats = statCalc.avatarStats(avatar)
    avatar.level = avatar.skills.reduce((total,s) => {return total + s.level},0)
    avatar.currentHealth = avatar.stats.other("1") //TODO: Think about doing something better with this
    return avatar
  }
}