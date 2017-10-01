const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate");
const ref = require("../../calc/reference");
const rand = require("../../calc/rand");
const itemCalc = require("../../calc/item");

it("Generates a plain item",function() {
  rand.setNextInt(1);
  let item = itemCalc.randomItem(0,0);
  item.name.should.equal("Club");
  item.mods.length.should.equal(0)
});

it("Generates a fixed item", function() {
  let mod = itemCalc.fixedMod(ref.getMod("+skill"),0,0);
  let item = itemCalc.fixedItem(ref.baseItems.atIndex(0),[mod]);
  item.name.should.equal("Sword");
  item.mods.length.should.equal(1)
});

it("Generates a mod", function() {
  rand.setNextInt(1);
  let info = itemCalc.itemGenInfo(1,null);
  let mod = itemCalc.attemptMod(info);
  info.should.be.a("object");
  mod.should.be.a("object");
  mod.refId.should.equal("+health");
  mod.power.should.equal(1);
  assert(mod.elementId == null)
});

it("Chooses and element",function() {
  let info = itemCalc.itemGenInfo(1,2);
  let mod = ref.mods.atIndex(0);
  rand.setNextInt(40);
  let element = itemCalc.chooseElement(mod,info.coreElement);
  element.id.should.equal("2")
});

it("Generates elemental mods", function() {
  rand.setNextInt(0);
  rand.setNextInt(40);
  let info = itemCalc.itemGenInfo(1,1);
  let mod = itemCalc.attemptMod(info);
  mod.refId.should.equal("+skill");
  mod.elementId.should.equal("1");

  rand.setNextInt(0);
  rand.setNextInt(4);
  info = itemCalc.itemGenInfo(1,1);
  mod = itemCalc.attemptMod(info);
  mod.refId.should.equal("+skill");
  mod.elementId.should.equal("4")
});

it("Assigns items", function() {
  const avatar = gen.emptyAvatar();

  let item1 = itemCalc.randomItem(0,0);
  let item2 = itemCalc.randomItem(0,0);

  assert(avatar.setItem(item1,"hand1") === null);
  avatar.itemAt("hand1")._id.should.equal(item1._id);
  avatar.setItem(item2,"hand1")._id.should.equal(item1._id);

  avatar.itemAt("hand1")._id.should.equal(item2._id)

});

it("Generates a complex item", function() {
  rand.setNextInt(1);
  let item = itemCalc.randomItem(10,0);
  item.name.should.equal("Club");
  
  console.log(item)
  //TODO: More for seeing the results than anything else
});

it("Calculates item resources", function() {
  let item = itemCalc.fixedItem(ref.baseItems.atIndex(0),[]);
  let itemRef = ref.baseItems.withId(item.name);
  let resources = itemCalc.itemResources(itemRef).adjustedList;
  let r1 = resources[0];
  r1.should.deep.equal({id:"1",quantity:5})
});

it("Breaks down and item",function() {
  let item = itemCalc.fixedItem(ref.baseItems.atIndex(2),[]);
  let resources = itemCalc.breakdown(item);
  resources.should.deep.equal([{id:"1",quantity:1}])
});
