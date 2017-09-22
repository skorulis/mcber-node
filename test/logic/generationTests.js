const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate")
const ref = require("../../calc/reference")
const statCalc = require("../../calc/statCalc")

it("Generates an empty avatar",function() { 
  const avatar = gen.emptyAvatar()
  avatar.level.should.equal(0)
  avatar.stats.other(statCalc.kStatIdHealth).should.equal(10)
  avatar.stats.other(statCalc.kStatIdSpeed).should.equal(100)
  avatar.id.should.be.a('string')
  avatar.skills.length.should.equal(15)
  avatar.skills[0].xpNext.should.equal(50)
})

it("Generates a fixed avatar",function() { 
  const avatar = gen.withLevels([10,0,0,0,0,0,0,0,0,0])
  assert(avatar.stats.skill(0) == 10)
  avatar.level.should.equal(10)
  avatar.stats.other(statCalc.kStatIdHealth).should.equal(20)
  avatar.stats.other(statCalc.kStatIdSpeed).should.equal(110)
  avatar.skills[0].xpNext.should.equal(1824)
  avatar.skills.length.should.equal(15)
})

it("Generates a random avatar",function() {
  const avatar = gen.randomAvatar(20)
  avatar.level.should.equal(20)

  assert(avatar.stats.other(statCalc.kStatIdHealth) >= 30,"Has health")
  assert(avatar.stats.other(statCalc.kStatIdSpeed) >= 120,"Has Speed")
})

it("Generates a realm", function() {
  var realm = gen.basicRealm(0,1)
  realm.level.should.equal(1)
  realm.elementId.should.equal(0)
})

it("Generates an item", function() {
  var baseItem = ref.items.baseTypes[0]
  var item = gen.emptyItem(baseItem)
  item._id.should.not.be.null
  item.name.should.equal("Sword")
  item.type.should.equal("weapon")

  var baseItem = ref.items.baseTypes[3]
  var item = gen.emptyItem(baseItem)
  item.name.should.equal("Shovel")
  item.type.should.equal("tool")
})