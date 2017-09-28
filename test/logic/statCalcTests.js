const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate");
const ref = require("../../calc/reference");
const itemCalc = require("../../calc/item");
const statCalc = require("../../calc/statCalc");

it("Generates default stats",function() {
  const avatar = gen.emptyAvatar();
  avatar.stats.should.be.a("object");
  avatar.stats.skill(0).should.equal(0);
  avatar.stats.other("1").should.equal(10)
});

it("Calculates simple item stats",function() {
  const avatar = gen.withLevels([0,10,0,0,0,0,0,0,0,0]);

  let mod = itemCalc.fixedMod(ref.getMod("+skill"),1,0);
  let item = itemCalc.fixedItem(ref.baseItems.atIndex(0),[mod]);

  avatar.setItem(item,"hand1");
  avatar.items.length.should.equal(1);
  let stats = statCalc.avatarStats(avatar);

  stats.skill("1").should.equal(10);
  stats.skill("0").should.equal(1);

});