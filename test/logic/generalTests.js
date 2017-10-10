const general = require("../../calc/activityCommon");

it("Calculates failure rates", function() {
  general.failureRate(20,20).should.equal(0.5);
  general.failureRate(10,10).should.equal(0.5);
  general.failureRate(1,20).should.equal(0.97);
  general.failureRate(1,100).should.equal(0.99);
  general.failureRate(100,1).should.equal(0);
});