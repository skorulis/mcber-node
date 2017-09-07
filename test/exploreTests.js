const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../calc/generate")
const explore = require("../calc/explore")

it("Calculates explore constants",function() {
  var realm = gen.basicRealm(0,1)
  var avatar = gen.withLevels([0,0,0,0,0,0,0,0,0,0])
  var constants = explore.initialValues(realm,avatar);
  constants.tickFrequency.should.equal(30)
})