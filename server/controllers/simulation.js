const gen = require("../../calc/generate")
const battle = require("../../calc/battle")


module.exports = {
  experiment1:function(req,res) {
    var avatars = []
    for(var i = 0; i < 10; ++i) {
      var a = gen.randomAvatar(100)
      var obj = {
        avatar:a,
        damage:0,
        wins:0
      }
      avatars.push(obj)
    }
    for(var i = 0; i < avatars.length; ++i) {
      for(var j = 0; j < avatars.length; ++j) {
        if (i != j) {
          var a1 = avatars[i]
          var a2 = avatars[j]
          const battleResult = battle.battle(a1.avatar,a2.avatar)
          a1.damage += battleResult.a1TotalDamage
          a2.damage += battleResult.a2TotalDamage
          a1.wins += (battleResult.winner == a1.avatar) ? 1 : 0
          a2.wins += (battleResult.winner == a2.avatar) ? 1 : 0

        }
      }
    }
 
    res.send(avatars)
  }
}