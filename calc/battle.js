const rand = require("./rand");
const ref = require("./reference");
const gen = require("./generate");

const chooseSkill = function(avatar) {
  let val = rand.getRandomInt(1,avatar.stats.elementalLevel());
  let index = 0;
  while(val > 0 && index < ref.elements.length) {
    val -= avatar.stats.skill(index);
    index ++
  }
  return avatar.skills[index - 1];
};

const calculateDamage = function(a1,a2,sAttack,sDefence) {
  const att = getTotalAttack(a1,sAttack,sDefence);
  const def = getTotalDefence(a2,sDefence);

  return Math.ceil(att * att / (att + def) )
};

const getMultiplier = function(sAttack,sDefence) {
  return ref.getSkill(sAttack.id).damageModifiers[parseInt(sDefence.id)]
};

const getTotalAttack = function(avatar,sAttack,sDefence) {
  return avatar.stats.skill(sAttack.id) * getMultiplier(sAttack,sDefence)
};

const getTotalDefence = function(avatar,sDefence) {
  return avatar.stats.skill(sDefence.id)
};

//Get the result from avatar 1 attacking avatar 2. No changes are made
const attack = function(a1,a2) {
  const attackSkill = chooseSkill(a1);
  const defenceSkill = chooseSkill(a2);
  return {
    damage:calculateDamage(a1,a2,attackSkill,defenceSkill),
    attackSkillId:attackSkill.id,
    defenceSkillId:defenceSkill.id
  }
};

//Returns the result of the 2 avatars battling. No changes are made
const battle = function(a1,a2) {
  let res = gen.emptyBattleResults(a1,a2);

  let attackRes;

  while(true) {
    attackRes = attack(a1,a2);
    res.a1Attacks.push(attackRes);
    res.a1TotalDamage += attackRes.damage;
    if (res.a1TotalDamage >= a2.currentHealth) {
      res.winnerId = a1._id;
      return res
    }

    attackRes = attack(a2,a1);
    res.a2Attacks.push(attackRes);
    res.a2TotalDamage += attackRes.damage;
    if (res.a2TotalDamage >= a1.currentHealth) {
      res.winnerId = a2._id;
      return res
    }
  }
};

const randomBattle = function(avatar,realm) {
  let minLevel = 2 * realm.level;
  let maxLevel = 5 * realm.level;
  let opponent = gen.randomAvatar(rand.getRandomInt(minLevel,maxLevel));
  return battle(avatar,opponent);
};

const getActivityResult = function(battleResults) {
  let results = gen.baseActivityResult();
  results.battleResult = battleResults;
  for (let att of battleResults.a1Attacks) {
    results.addExperience(att.attackSkillId,att.damage);
  }
  for (let def of battleResults.a2Attacks) {
    results.addExperience(def.defenceSkillId,def.damage);
  }

  return results;
};

module.exports = {
  attack,
  chooseSkill,
  calculateDamage,
  battle,
  randomBattle,
  getActivityResult
};