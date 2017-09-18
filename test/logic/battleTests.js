const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate")
const battle = require("../../calc/battle")

it("Chooses a skill",function() {
  const avatar = gen.withLevels([0,0,10,0,0,0,0,0,0,0])
  avatar.skills.length.should.equal(15)
  avatar.skillLevel(2).should.equal(10)
  const skill = battle.chooseSkill(avatar)
  skill.should.equal(2)
})

it("Performs an attack",function() { 
  const a1 = gen.withLevels([10,0,0,0,0,0,0,0,0,0])
  const a2 = gen.withLevels([10,0,0,0,0,0,0,0,0,0])
  const result = battle.attack(a1,a2)
  assert(result != null)
  assert(result.damage == 5)
  assert(result.attackSkill == 0)
  assert(result.defenceSkill == 0)
})

it("Performs an attack 2",function() { 
  const a1 = gen.withLevels([0,10,0,0,0,0,0,0,0,0])
  const a2 = gen.withLevels([0,0,0,10,0,0,0,0,0,0])
  const result = battle.attack(a1,a2)
  assert(result != null)
  assert(result.damage == 14)
  assert(result.attackSkill == 1)
  assert(result.defenceSkill == 3)
})

it("Performs an attack 3",function() { 
  const a1 = gen.withLevels([0,0,10,0,0,0,0,0,0,0])
  const a2 = gen.withLevels([10,0,0,0,0,0,0,0,0,0])
  const result = battle.attack(a1,a2)
  assert(result != null)
  result.damage.should.equal(9)
  assert(result.attackSkill == 2)
  assert(result.defenceSkill == 0)
})

it("Completes a battle",function() { 
  const a1 = gen.withLevels([10,0,0,0,0,0,0,0,0,0])
  const a2 = gen.withLevels([10,0,0,0,0,0,0,0,0,0])
  const result = battle.battle(a1,a2)
  assert(result != null)
  assert(result.winner == a1)
  assert(result.a1Attacks.length == 2)
  assert(result.a1TotalDamage == 10)
  assert(result.a2TotalDamage == 5)
})
