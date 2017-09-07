const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8'));
const rand = require("./rand")

const chooseSkill = function(avatar) {
  var val = rand.getRandomInt(1,avatar.level)
  var index = 0
  while(val > 0) {
    val -= avatar.skills[index]
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
  return skills.elements[sAttack].damageModifiers[sDefence]
}

const getTotalAttack = function(avatar,sAttack,sDefence) {
  return avatar.skills[sAttack] * getMultiplier(sAttack,sDefence)
}

const getTotalDefence = function(avatar,sDefence) {
  return avatar.skills[sDefence]
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

module.exports = {
  attack:attack,
  chooseSkill:chooseSkill
}