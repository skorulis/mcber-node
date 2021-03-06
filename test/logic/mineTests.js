const gen = require("../../calc/generate");
const mineCalc = require("../../calc/mine");
const ref = require("../../calc/reference");
const rand = require("../../calc/rand");
const ResourceContainer = require("../../util/ResourceContainer");

it("Should calculate initial values",function() {
  let avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,0,0,0,0]);
  let realm = gen.basicRealm("0",1);
  let initial = mineCalc.initialValues(realm,avatar);
  initial.skillLevel.should.equal(10);
  initial.usedSkills.should.deep.equal(["0","101"]);
  initial.duration.should.equal(3);

  avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,20,0,0,0,0]);
  realm = gen.basicRealm("0",5);
  initial = mineCalc.initialValues(realm,avatar);
  console.log(initial);
  initial.skillLevel.should.equal(30);
  initial.duration.should.equal(24);
});

it("Should get results",function() {
  let avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,0,0,0,0]);
  let realm = gen.basicRealm("0",1);
  let initial = mineCalc.initialValues(realm,avatar);

  let result = mineCalc.getResult(realm,avatar,initial);
  let r1 = result.resources[0];
  r1.quantity.should.equal(2);

  let xp1 = result.experience[0];
  xp1.xp.should.equal(3);
});