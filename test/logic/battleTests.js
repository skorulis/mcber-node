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
  result.attackSkillId.should.equal("0");
  result.defenceSkillId.should.equal("0");
  result.damage.should.equal(5);
});

it("Performs an attack 2",function() {
  const a1 = gen.withLevels([0,10,0,0,0,0,0,0,0,0]);
  const a2 = gen.withLevels([0,0,0,10,0,0,0,0,0,0]);
  const result = battle.attack(a1,a2);
  result.damage.should.equal(14);
  result.attackSkillId.should.equal("1");
  result.defenceSkillId.should.equal("3");
});

it("Performs an attack 3",function() {
  const a1 = gen.withLevels([0,0,10,0,0,0,0,0,0,0]);
  const a2 = gen.withLevels([10,0,0,0,0,0,0,0,0,0]);
  const result = battle.attack(a1,a2);
  result.damage.should.equal(9);
  result.attackSkillId.should.equal("2");
  result.defenceSkillId.should.equal("0");
});

it("Completes a battle",function() {
  const a1 = gen.withLevels([10,0,0,0,0,0,0,0,0,0]);
  const a2 = gen.withLevels([10,0,0,0,0,0,0,0,0,0]);
  const result = battle.battle(a1,a2);
  result.winnerId.should.equal(a1._id);
  result.a1Attacks.length.should.equal(4);
  result.a1TotalDamage.should.equal(20);
  result.a2TotalDamage.should.equal(15);

  let attack1 = result.a1Attacks[0];
  attack1.attackSkillId.should.equal("0");

  const rewards = battle.getActivityResult(result);
  rewards.experience.should.be.a("array");
  const xp1 = rewards.experience[0];
  xp1.skillId.should.equal("0");
  xp1.xp.should.equal(35);

});

it("Has a random battle", function() {
  const a1 = gen.withLevels([15,0,0,0,0,0,0,0,0,0]);
  const realm = gen.basicRealm("1",2);
  const result = battle.randomBattle(a1,realm);
  result.winnerId.should.equal(a1._id);
  result.avatar2.id.should.be.a("string")
});
