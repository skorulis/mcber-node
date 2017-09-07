const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../calc/generate")

it("Generates an empty avatar",function() { 
  const avatar = gen.emptyAvatar()
  avatar.level.should.equal(0)
  avatar.health.should.equal(0)
  avatar.speed.should.equal(0)
  avatar.skills.elements.length.should.equal(10)
})

it("Generates an fixed avatar",function() { 
  const avatar = gen.withLevels([10,0,0,0,0,0,0,0,0,0])
  assert(avatar.skills.elements[0] == 10)
  avatar.level.should.equal(10)
  avatar.health.should.equal(10)
  avatar.speed.should.equal(10)

})

it("Generates a random avatar",function() {
  const avatar = gen.randomAvatar(20)
  avatar.level.should.equal(20)
  assert(avatar.health >= 20,"Has health")
  assert(avatar.speed >= 20,"Has Speed")
})