const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate")
const explore = require("../../calc/explore")
const ref = require("../../calc/reference")
const rand = require("../../calc/rand")
const update = require("../../calc/update")

it("Calculates explore constants",function() {
  var realm = gen.basicRealm(0,1)
  var avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0])
  var constants = explore.initialValues(realm,avatar);
  constants.tickFrequency.should.equal(30)
  constants.skillLevel.should.equal(0)

  avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,0,7,15,0])
  constants = explore.initialValues(realm,avatar);
  constants.skillLevel.should.equal(25)
  constants.tickFrequency.should.equal(2)
})

it("Calculates empty results", function() {
  var realm = gen.basicRealm(0,1)
  var avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0])
  var results = explore.explore(realm,avatar,20)
  results.length.should.equal(0)
})

it("Chooses a resource", function() {
  var realm = gen.basicRealm(0,1)
  var resource = explore.chooseResource(realm)
  resource.name.should.equal("Iron")
  resource.id.should.equal("1")
})

it("Calculates resource quantity", function() {
  var realm = gen.basicRealm(0,1)
  var resource = ref.skills[0].resources[0]
  var quantity = explore.calculateResourceQuantity(realm,null,resource)
  quantity.should.equal(1)
  resource.id.should.equal("1")
})

it("Calculates single results",function() {
  var realm = gen.basicRealm(0,1)
  var avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0])
  var results = explore.explore(realm,avatar,30)
  results.length.should.equal(1)

  var r1 = results[0]
  var xp = r1.experience[0]
  xp.xp.should.equal(40)
  xp.type.should.equal("elemental")
  xp.skillId.should.equal(0)
  r1.resource.quantity.should.equal(1)
  r1.resource.id.should.equal("1")
})

it("Unlocks a new realm level",function() {
  var user = gen.newUser()
  var realm = user.findRealm(0)
  realm.level = realm.maximumLevel
  var avatar = user.avatars[0]
  rand.setNextInt(100)
  var results = explore.explore(realm,avatar,30)
  results.length.should.equal(1)
  var r1 = results[0]
  r1.realmUnlock.level.should.equal(2)
  r1.realmUnlock.elementId.should.equal(realm.elementId)

  update.completeActivity("0",user,avatar,r1)
  user.findRealm(0).maximumLevel.should.equal(2)
})

it("Finds a new item", function() {
  var user = gen.newUser()
  var realm = user.findRealm(0)
  realm.level = realm.maximumLevel
  var avatar = user.avatars[0]
  rand.setNextInt(0);rand.setNextInt(100)
  var results = explore.explore(realm,avatar,30)
  results.length.should.equal(1)
  var r1 = results[0]
  r1.item.should.not.be.null
  r1.item.name.should.not.be.null
  assert(r1.realmUnlock == null)

  user.items.length.should.equal(0)
  update.completeActivity("0",user,avatar,r1)
  user.items.length.should.equal(1)
})