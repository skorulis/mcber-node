const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const Counter = require("../../util/Counter.js")

it("Does some counting",function() {
  var c1 = new Counter()
  c1.should.not.be.null
  c1.add("test",5)
  c1.valueFor("test").should.equal(5)
  c1.valueFor("empty").should.equal(0)
  c1.add("test",5)
  c1.valueFor("test").should.equal(10)
  var result = c1.asNamedArray("id","quantity")
  result.should.deep.equal([{id:"test",quantity:10}])
})