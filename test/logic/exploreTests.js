const chai = require('chai');
const should = chai.should();
const gen = require("../../calc/generate");
const explore = require("../../calc/explore");
const ref = require("../../calc/reference");
const rand = require("../../calc/rand");
const update = require("../../calc/update");

it("Calculates explore constants",function() {
  let realm = gen.basicRealm(0,1);
  let avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0]);
  let constants = explore.initialValues(realm,avatar);
  constants.duration.should.equal(30);
  constants.skillLevel.should.equal(0);

  avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,0,7,15,0]);
  constants = explore.initialValues(realm,avatar);
  constants.skillLevel.should.equal(25);
  constants.duration.should.equal(2)
});

it("Calculates empty results", function() {
  let realm = gen.basicRealm(0,1);
  let avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0]);
  let results = explore.explore(realm,avatar,20);
  results.length.should.equal(0)
});

it("Chooses a resource", function() {
  var realm = gen.basicRealm(0,1)
  var resource = explore.chooseResource(realm)
  resource.name.should.equal("Iron")
  resource.id.should.equal("1")
})

it("Calculates resource quantity", function() {
  let realm = gen.basicRealm(0,1);
  let resource = ref.skills.array[0].resources[0];
  let quantity = explore.calculateResourceQuantity(realm,null,resource);
  quantity.should.equal(1);
  resource.id.should.equal("1")
});

it("Calculates single results",function() {
  let realm = gen.basicRealm(0,1);
  let avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0]);
  let results = explore.explore(realm,avatar,30);
  results.length.should.equal(1);

  let r1 = results[0];
  let xp = r1.experience[0];
  xp.xp.should.equal(40);
  xp.skillId.should.equal("0");
  let res1 = r1.resources[0];
  res1.quantity.should.equal(1);
  res1.id.should.equal("1")
});

it("Unlocks a new realm level",function() {
  let user = gen.newUser();
  let realm = user.findRealm("0");
  realm.level = realm.maximumLevel;
  let avatar = user.avatars[0];
  rand.setNextInt(1);
  rand.setNextInt(100);
  let results = explore.explore(realm,avatar,30);
  results.length.should.equal(1);
  let r1 = results[0];
  r1.currency.should.equal(1);
  r1.realmUnlock.level.should.equal(2);
  r1.realmUnlock.elementId.should.equal(realm.elementId);

  update.completeActivity("0",user,avatar,r1);
  user.findRealm("0").maximumLevel.should.equal(2)
});

it("Finds a new item", function() {
  let user = gen.newUser();
  let realm = user.findRealm("0");
  realm.level = realm.maximumLevel;
  let avatar = user.avatars[0];
  rand.setNextInt(1);rand.setNextInt(0);rand.setNextInt(100);rand.setNextInt(55);
  let results = explore.explore(realm,avatar,30);
  results.length.should.equal(1);
  let r1 = results[0];

  should.not.exist(r1.realmUnlock);

  r1.currency.should.equal(1);
  r1.item.should.be.a("object");
  r1.item.refId.should.be.a("string");

  user.items.length.should.equal(0);
  update.completeActivity("0",user,avatar,r1);
  user.items.length.should.equal(1);
  user.currency.should.equal(1);
});

it("Finds a new gem", function() {
  let user = gen.newUser();
  let realm = user.findRealm("1");
  realm.level = realm.maximumLevel;
  let avatar = user.avatars[0];
  rand.setNextInt(0);rand.setNextInt(0);rand.setNextInt(100);rand.setNextInt(0);
  let results = explore.explore(realm,avatar,30);
  results.length.should.equal(1);
  let r1 = results[0];

  r1.gem.should.be.a("object");
  r1.gem.refId.should.be.a("string");
  r1.gem.power.should.be.a("number")

});