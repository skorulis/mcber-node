const rand = require("./rand")
const ref = require("./reference")

const chooseSkill = function(avatar) {
  var val = rand.getRandomInt(1,avatar.level)
  var index = 0
  while(val > 0) {
    val -= avatar.skills.elements[index]
    index ++
  }
  return index - 1
}

const calculateDamage = function(a1,a2,sAttack,sDefence) {
  const att = getTotalAttack(a1,sAttack,sDefence)
  const def = getTotalDefence(a2,sDefence)
  return Math.ceil(att * att / (att + def) )
}

const getMultiplier = function(sAttack,sDefence) {
  return ref.skills.elements[sAttack].damageModifiers[sDefence]
}

const getTotalAttack = function(avatar,sAttack,sDefence) {
  return avatar.skills.elements[sAttack] * getMultiplier(sAttack,sDefence)
}

const getTotalDefence = function(avatar,sDefence) {
  return avatar.skills.elements[sDefence]
}

//Get the result from avatar 1 attacking avatar 2. No changes are made
const attack = function(a1,a2) {
  const attackSkill = chooseSkill(a1)
  const defenceSkill = chooseSkill(a2)
  return {
    damage:calculateDamage(a1,a2,attackSkill,defenceSkill),
    attackSkill:attackSkill,
    defenceSkill:defenceSkill
  }
}

//Returns the result of the 2 avatars battling. No changes are made
const battle = function(a1,a2) {
  var res = {
    winner:null,
    a1Attacks:[],
    a2Attacks:[],
    a1TotalDamage:0,
    a2TotalDamage:0
  }
  var attackRes;

  while(true) {
    attackRes = attack(a1,a2)
    res.a1Attacks.push(attackRes)
    res.a1TotalDamage += attackRes.damage;
    if (res.a1TotalDamage >= a2.health) {
      res.winner = a1
      return res
    }

    attackRes = attack(a2,a1)
    res.a2Attacks.push(attackRes)
    res.a2TotalDamage += attackRes.damage
    if (res.a2TotalDamage >= a1.health) {
      res.winner = a2
      return res
    }
  }
}

module.exports = {
  attack,
  chooseSkill,
  calculateDamage,
  battle
}