const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate");
const battle = require("../../calc/battle");

it("Chooses a skill",function() {
  const avatar = gen.withLevels([0,0,10,0,0,0,0,0,0,0]);
  avatar.skills.length.should.equal(15);
  avatar.stats.skill("2").should.equal(10);
  const skill = battle.chooseSkill(avatar);
  skill.id.should.equal("2")
});

it("Performs an attack",function() {
  const a1 = gen.withLevels([10,0,0,0,0,0,0,0,0,0]);
  const a2 = gen.withLevels([10,0,0,0,0,0,0,0,0,0]);
  const result = battle.attack(a1,a2);
  result.should.be.a("object");
  result.attackSkill.should.equal("0");
  result.defenceSkill.should.equal("0");
  result.damage.should.equal(5);
});

it("Performs an attack 2",function() {
  const a1 = gen.withLevels([0,10,0,0,0,0,0,0,0,0]);
  const a2 = gen.withLevels([0,0,0,10,0,0,0,0,0,0]);
  const result = battle.attack(a1,a2);
  result.damage.should.equal(14);
  result.attackSkill.should.equal("1");
  result.defenceSkill.should.equal("3");
});

it("Performs an attack 3",function() {
  const a1 = gen.withLevels([0,0,10,0,0,0,0,0,0,0]);
  const a2 = gen.withLevels([10,0,0,0,0,0,0,0,0,0]);
  const result = battle.attack(a1,a2);
  result.damage.should.equal(9);
  result.attackSkill.should.equal("2");
  result.defenceSkill.should.equal("0");
});

it("Completes a battle",function() {
  const a1 = gen.withLevels([10,0,0,0,0,0,0,0,0,0]);
  const a2 = gen.withLevels([10,0,0,0,0,0,0,0,0,0]);
  const result = battle.battle(a1,a2);
  result.winnerId.should.equal(a1._id);
  result.a1Attacks.length.should.equal(4);
  result.a1TotalDamage.should.equal(20);
  result.a2TotalDamage.should.equal(15);
});
