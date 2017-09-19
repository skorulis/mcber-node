process.env.NODE_ENV = "test"
var chai = require('chai');
const assert = chai.assert;
var should = chai.should();
var app = require("../../app")("mongodb://localhost:27017/mcberTest1");
var supertest = require("supertest")(app);
const helpers = require("../testHelpers")(supertest)
const itemCalc = require("../../calc/item")
const User = require("../../model").User
const rand = require("../../calc/rand")

var token = null;
var avatar = null;
var user = null;
var item = null;

function findUser() {
  User.findOne({email:"item@test.com"}, (err,u) => {
    user = u
  })
}

//TODO: Test works with only but is broken due to dodgy timing. Need to look into pre setting up the database
describe("Performs all item methods",function() {
  it("Sets up the user",function(done) {
    supertest.post("/api/signup")
    .send({"email":"item@test.com",password:"dummy"})
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .expect(function(res) {
      token = res.body.auth.token
      token.should.not.be.null
      avatar = res.body.user.avatars[0]
      findUser()
      done()
    })
    .end()
  })

  it("Creates an item", function(done) {
    rand.setNextInt(1)
    var item = itemCalc.randomItem(0,0)
    item.name.should.equal("Club")
    assert(user != null)
    user.items.push(item)
    user.items.length.should.equal(1)
    user.save((err,u) => {
      done()
    })
  })

  it("Checks for item", function(done) {
    helpers.authGet("/api/user/current",token)
    .expect(function(res) {
      var u = res.body.user;
      u.items.length.should.equal(1)
      item = u.items[0]
      item.name.should.equal("Club")
      item._id.should.not.be.null
    })
    .end(done)
  })

  it("Assigns an item",function(done) {
    var body = {avatarId:avatar._id,itemId:item._id,slot:"hand1"}
    helpers.jsonAuthPost("/api/item/assign",token,body)
      .expect(200)
      .expect(function(res) {
        res.body.avatar.should.not.be.null
        res.body.avatar.items.length.should.equal(1)
        var item = res.body.avatar.items[0]
        item.item.name.should.equal("Club")
        item.slot.should.equal("hand1")
      })
      .end(done)
  })

})