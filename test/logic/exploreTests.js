const chai = require('chai');
const should = chai.should();
const gen = require("../../calc/generate");
const explore = require("../../calc/explore");
const ref = require("../../calc/reference");
const rand = require("../../calc/rand");
const update = require("../../calc/update");
const squelch = require("../../calc/squelch");

it("Calculates explore constants",function() {
  let realm = gen.basicRealm("0",1);
  let avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0]);
  let constants = explore.initialValues(realm,avatar);
  constants.duration.should.equal(30);
  constants.skillLevel.should.equal(0);

  avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,0,7,15,0]);
  constants = explore.initialValues(realm,avatar);
  constants.skillLevel.should.equal(25);
  constants.duration.should.equal(3)
});

it("Chooses a resource", function() {
  let realm = gen.basicRealm("0",1);
  let resource = explore.chooseResource(realm);
  resource.name.should.equal("Iron");
  resource.id.should.equal("1")
});

it("Calculates resource quantity", function() {
  let realm = gen.basicRealm("0",1);
  let resource = ref.skills.array[0].resources[0];
  let quantity = explore.calculateResourceQuantity(realm,null,resource);
  quantity.should.equal(1);
  resource.id.should.equal("1")
});

it("Calculates single results",function() {
  let realm = gen.basicRealm("0",1);
  let avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0]);
  let constants = explore.initialValues(realm,avatar);
  let results = explore.getExploreResult(realm,avatar,constants);

  let xp = results.experience[0];
  xp.xp.should.equal(40);
  xp.skillId.should.equal("0");
  let res1 = results.resources[0];
  res1.quantity.should.equal(1);
  res1.id.should.equal("1")
});


it("Fails exploring", function() {
  let realm = gen.basicRealm("0",5);
  let avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0]);
  let initial = explore.initialValues(realm,avatar);
  rand.setNextDouble(0.5,"failureCheck");
  let result = explore.getExploreResult(realm,avatar,initial);
  result.success.should.equal(false);
});

it("Unlocks a new realm level",function() {
  let user = gen.newUser();
  let realm = user.findRealm("0");
  realm.level = realm.maximumLevel;
  let avatar = user.avatars[0];
  let initial = explore.initialValues(realm,avatar);
  rand.setNextInt(100,"realmUnlock");
  rand.setNextInt(1,"findCurrency");
  let results = explore.getExploreResult(realm,avatar,initial);
  results.currency.should.equal(1);
  results.realmUnlock.level.should.equal(2);
  results.realmUnlock.elementId.should.equal(realm.elementId);

  update.completeActivity("0",user,avatar,results);
  user.findRealm("0").maximumLevel.should.equal(2)
});

it("Finds a new item", function() {
  let user = gen.newUser();
  let realm = user.findRealm("0");
  realm.level = realm.maximumLevel;
  let avatar = user.avatars[0];
  let initial = explore.initialValues(realm,avatar);
  rand.setNextInt(1,"findCurrency");
  rand.setNextInt(100,"findGemOrItem");
  rand.setNextInt(55,"gemOrItem");
  rand.setNextInt(0,"realmUnlock");
  let results = explore.getExploreResult(realm,avatar,initial);

  should.not.exist(results.realmUnlock);

  results.currency.should.equal(1);
  results.item.should.be.a("object");
  results.item.refId.should.be.a("string");

  user.items.length.should.equal(0);
  update.completeActivity("0",user,avatar,results);
  user.items.length.should.equal(1);
  user.currency.should.equal(1);
});

it("Finds a new gem", function() {
  let user = gen.newUser();
  let realm = user.findRealm("1");
  realm.level = realm.maximumLevel;
  let avatar = user.avatars[0];
  let initial = explore.initialValues(realm,avatar);
  rand.setNextInt(100,"findGemOrItem");
  rand.setNextInt(0,"gemOrItem");
  let results = explore.getExploreResult(realm,avatar,initial);

  results.gem.should.be.a("object");
  results.gem.refId.should.be.a("string");
  results.gem.power.should.be.a("number")
});

it("Finds a new avatar", function() {
  let user = gen.newUser();
  let realm = user.findRealm("1");
  realm.level = realm.maximumLevel;
  let avatar = user.avatars[0];
  let initial = explore.initialValues(realm,avatar);

  rand.setNextDouble(1,"findAvatar");
  let results = explore.getExploreResult(realm,avatar,initial);
  update.completeActivity("0",user,avatar,results);
  user.avatars.length.should.equal(2);

  results.foundAvatar.should.be.a("object");
});


it("Auto squelched an item", function() {
  let user = gen.newUser();
  user.setOption("item auto squelch level",2);
  user.setOption("item auto squelch level",2);
  let realm = user.findRealm("1");
  realm.level = realm.maximumLevel;
  let avatar = user.avatars[0];
  let initial = explore.initialValues(realm,avatar);

  rand.setNextInt(100,"findGemOrItem");
  rand.setNextInt(55,"gemOrItem");

  let result = explore.getExploreResult(realm,avatar,initial);
  squelch.squelchResult(user,result);
  should.not.exist(result.item);

});