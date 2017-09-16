const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate")
const explore = require("../../calc/explore")
const ref = require("../../calc/reference")

it("Calculates explore constants",function() {
  var realm = gen.basicRealm(0,1)
  var avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0])
  var constants = explore.initialValues(realm,avatar);
  constants.tickFrequency.should.equal(30)
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
  var resource = ref.skills.elements[0].resources[0]
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
  xp.xp.should.equal(30)
  xp.type.should.equal("elemental")
  xp.skillId.should.equal(0)
  r1.resource.quantity.should.equal(1)
  r1.resource.id.should.equal("1")
  
})