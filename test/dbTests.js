const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const mongoose = require('mongoose');
const User = require("../model").User

mongoose.connect("mongodb://localhost:27017/mcberTest1",{useMongoClient: true});
mongoose.Promise = global.Promise

it("Saves a user",function(done) {
  var user = new User({_id:"1234",email:"test@gmail.com"})
  user.save((err,user) => {
    user.email.should.equal("test@gmail.com")
    User.find({_id:"1234"},function(err,users) {
      users[0]._id.should.equal("1234")
      users.length.should.equal(1)
      done()
    })
  })
})