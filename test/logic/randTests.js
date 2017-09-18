const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const rand = require("../../calc/rand")

it("Generates a fixed sequence", function() {
  rand.setNextIntArray([1,2,3,4])
  rand.getRandomInt(0,0).should.equal(1)
  rand.getRandomInt(0,0).should.equal(2)
  rand.getRandomInt(0,0).should.equal(3)
  rand.getRandomInt(0,0).should.equal(4)

})