const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../calc/generate")
const battle = require("../calc/battle")

it("Performs an attack",function() { 
  const a1 = gen.withLevels([10,0,0,0,0,0,0,0,0,0])
  const a2 = gen.withLevels([10,0,0,0,0,0,0,0,0,0])
  const result = battle.attack(a1,a2)
  assert(result != null)
})