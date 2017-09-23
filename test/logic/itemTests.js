const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate")
const ref = require("../../calc/reference")
const rand = require("../../calc/rand")
const itemCalc = require("../../calc/item")

it("Generates a plain item",function() {
  rand.setNextInt(1)
  var item = itemCalc.randomItem(0,0)
  item.name.should.equal("Club")
  item.mods.length.should.equal(0)
})

it("Generates a fixed item", function() {
  var mod = itemCalc.fixedMod(ref.getMod("+skill"),0,0)
  var item = itemCalc.fixedItem(ref.baseItem(0),[mod])
  item.name.should.equal("Sword")
  item.mods.length.should.equal(1)
})

it("Generates a mod", function() {
  rand.setNextInt(1)
  var info = itemCalc.itemGenInfo(1,null)
  var mod = itemCalc.attemptMod(info)
  mod.should.not.be.null
  mod.id.should.equal("+health")
  mod.power.should.equal(1)
  assert(mod.elementId == null)
})

it("Chooses and element",function() {
  var info = itemCalc.itemGenInfo(1,2)
  var mod = ref.mods[0]
  rand.setNextInt(40)
  var elementId = itemCalc.chooseElement(mod,info)
  elementId.should.equal(2)
})

it("Generates elemental mods", function() {
  rand.setNextInt(0)
  rand.setNextInt(40)
  var info = itemCalc.itemGenInfo(1,1)
  var mod = itemCalc.attemptMod(info)
  mod.id.should.equal("+skill")
  mod.elementId.should.equal(1)

  rand.setNextInt(0)
  rand.setNextInt(4)
  info = itemCalc.itemGenInfo(1,1)
  mod = itemCalc.attemptMod(info)
  mod.id.should.equal("+skill")
  mod.elementId.should.equal(4)
})

it("Assigns items", function() {
  const avatar = gen.emptyAvatar()

  var item1 = itemCalc.randomItem(0,0)
  var item2 = itemCalc.randomItem(0,0)

  assert(avatar.setItem(item1,"hand1") == null)
  avatar.itemAt("hand1")._id.should.equal(item1._id)
  avatar.setItem(item2,"hand1")._id.should.equal(item1._id)

  avatar.itemAt("hand1")._id.should.equal(item2._id)

})

it("Generates a complex item", function() {
  rand.setNextInt(1)
  var item = itemCalc.randomItem(10,0)
  item.name.should.equal("Club")
  
  console.log(item)
  //TODO: More for seeing the results than anything else
})

it("Calculates item resources", function() {
  var item = itemCalc.fixedItem(ref.baseItem(0),[])
  var resources = itemCalc.requiredResources(item)
  var r1 = resources[0]
  r1.should.deep.equal({id:"1",quantity:5})
})

