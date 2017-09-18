const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const ref = require("../../calc/reference")
const rand = require("../../calc/rand")
const itemCalc = require("../../calc/item")

it.only("Generates a plain item",function() {
  rand.setNextInt(1)
  var item = itemCalc.randomItem(0,0)
  item.name.should.equal("Club")
  item.mods.length.should.equal(0)
})

it.only("Generates a mod", function() {
  rand.setNextInt(1)
  var info = itemCalc.itemGenInfo(1,null)
  var mod = itemCalc.attemptMod(info)
  mod.should.not.be.null
  mod.id.should.equal("+health")
  mod.power.should.equal(1)
  assert(mod.elementId == null)
})

