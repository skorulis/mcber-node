const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const ref = require("../../calc/reference")

it("Has reference items", function() {
  ref.should.not.be.null
  ref.skills.should.not.be.null
  ref.resources.should.not.be.null
  ref.mods.should.not.be.null
  ref.items.should.not.be.null

  assert(ref.skills.length >= 15)
})

it("Gets a skill", function() {
  var skill = ref.getSkill(9)
  skill.name.should.equal("Dark")
})

it("Skills have resources",function() {
  assert(ref.getSkill(0).resources.length > 1)
})