const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate")
const ref = require("../../calc/reference")


it("Generates default stats",function() {
  const avatar = gen.emptyAvatar()
  avatar.stats.should.not.be.null
  avatar.stats.skill(0).should.equal(0)
  avatar.stats.other("1").should.equal(10)
})