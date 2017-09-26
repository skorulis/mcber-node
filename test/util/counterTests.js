const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const Counter = require("../../util/Counter.js");

it("Does some counting",function() {
  let c1 = new Counter();
  c1.should.not.be.null;
  c1.add("test",5);
  c1.valueFor("test").should.equal(5);
  c1.valueFor("empty").should.equal(0);
  c1.add("test",5);
  c1.valueFor("test").should.equal(10);
  let result = c1.asNamedArray("id","quantity");
  result.should.deep.equal([{id:"test",quantity:10}])
});

it("Adds multiple",function() {
    let c1 = new Counter();
    let values = [{id:"1",quantity:5},{id:"2",quantity:3},{id:"3",quantity:4}];
    c1.addAll(values,"id","quantity");
    c1.valueFor("1").should.equal(5);
    c1.valueFor("2").should.equal(3);

    let max = c1.maxValue();
    max.key.should.equal("1");
    max.value.should.equal(5);

});

