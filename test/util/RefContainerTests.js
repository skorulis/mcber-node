const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const RefContainer = require("../../util/RefContainer");

it("Adds int key objects", function() {
    let data = [{id:1,name:"test"},{id:2,name:"test2"},{id:3,name:"test4"}];
    let container = new RefContainer(data,"id");

    container.withId("1").should.deep.equal({id:1,name:"test"});
    container.withId(2).should.deep.equal({id:2,name:"test2"});

});