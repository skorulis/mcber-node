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
})