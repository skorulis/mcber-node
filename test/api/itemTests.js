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
var item1 = null;
var item2 = null;


describe("Performs all item methods",function() {
  it("Sets up the user",function(done) {
    supertest.post("/api/signup")
    .send({"email":"item@test.com",password:"dummy"})
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .expect(function(res) {
      token = res.body.auth.token
      token.should.not.be.null
      avatar = res.body.user.avatars[0]
    })
    .end(done)
  })

  it("Finds the user",function(done) {
    User.findOne({email:"item@test.com"}, (err,u) => {
      user = u
      user.should.not.be.null
      var resource = {id:"1",quantity:10}
      user.addResource(resource)
      user.save((err,u) => {
        done()
      })
    })
  })

  it("Creates 2 items", function(done) {
    rand.setNextInt(1)
    var item = itemCalc.randomItem(0,0)
    item.name.should.equal("Club")
    assert(user != null)
    user.items.push(item)

    rand.setNextInt(2)
    item = itemCalc.randomItem(0,0)
    item.name.should.equal("Spear")
    user.items.push(item)

    user.items.length.should.equal(2)
    user.save((err,u) => {
      done()
    })
  })

  it("Checks for item", function(done) {
    helpers.authGet("/api/user/current",token)
    .expect(function(res) {
      var u = res.body.user;
      u.items.length.should.equal(2)
      item1 = u.items[0]
      item1.name.should.equal("Club")
      item1._id.should.not.be.null

      item2 = u.items[1]
    })
    .end(done)
  })

  it("Assigns an item",function(done) {
    var body = {avatarId:avatar._id,itemId:item1._id,slot:"hand1"}
    helpers.jsonAuthPost("/api/item/assign",token,body)
      .expect(200)
      .expect(function(res) {
        res.body.avatar.should.not.be.null
        res.body.avatar.items.length.should.equal(1)
        assert(res.body.removedItem == null)
        var item = res.body.avatar.items[0]
        item.item.name.should.equal("Club")
        item.slot.should.equal("hand1")
      })
      .end(done)
  })

  it("Checks for an missing item", function(done) {
    helpers.authGet("/api/user/current",token)
    .expect(function(res) {
      var u = res.body.user;
      u.items.length.should.equal(1)
      u.items[0].name.should.equal("Spear")
      u.avatars[0].items.length.should.equal(1)
    })
    .end(done)
  })

  it("Reassigns an item",function(done) {
    var body = {avatarId:avatar._id,itemId:item2._id,slot:"hand1"}
    helpers.jsonAuthPost("/api/item/assign",token,body)
      .expect(200)
      .expect(function(res) {
        res.body.avatar.should.not.be.null
        res.body.avatar.items.length.should.equal(1)
        var item = res.body.avatar.items[0]
        item.item.name.should.equal("Spear")
        item.slot.should.equal("hand1")

        res.body.removedItem.should.not.be.null
        res.body.removedItem._id.should.equal(item1._id)
      })
      .end(done)
  })

  it("Checks for replaced item", function(done) {
    User.findOne({email:"item@test.com"}, (err,u) => {
      u.items.length.should.equal(1)
      done()
    })
  })

  it("Removes an item",function(done) {
    var body = {avatarId:avatar._id,slot:"hand1"}
    helpers.jsonAuthPost("/api/item/assign",token,body)
      .expect(200)
      .expect(function(res) {
        res.body.avatar.items.length.should.equal(1)
        var item = res.body.avatar.items[0]
        item.slot.should.equal("hand1")
        assert(item.item == null)
        res.body.removedItem._id.should.equal(item2._id)
      })
      .end(done)
  })

  it("Checks for both item", function(done) {
    User.findOne({email:"item@test.com"}, (err,u) => {
      u.items.length.should.equal(2)
      done()
    })
  })

  it("Breaks down an item", function(done) {
    var body = {itemId:item2._id}
    helpers.jsonAuthPost("/api/item/breakdown",token,body)
      .expect(200)
      .expect(function(res) {
        res.body.resources.length.should.equal(1)
        res.body.resources[0].should.deep.equal({id:"1",quantity:1})
      })
      .end(done)
  })

  it("Checks for missing item", function(done) {
    User.findOne({email:"item@test.com"}, (err,u) => {
      u.items.length.should.equal(1)
      done()
    })
  })

  it("Can't create a spear",function(done) {
    var body = {itemName:"Spear",avatarId:avatar._id}
    helpers.jsonAuthPost("/api/action/craft",token,body)
    .expect(helpers.checkStatusCode(400))
    .end(done)
  })

  it("Does create a sword",function(done) {
    var body = {itemName:"Sword",avatarId:avatar._id}
    helpers.jsonAuthPost("/api/action/craft",token,body)
    .expect(helpers.checkStatusCode(200))
    .expect(function(res) {
      res.body.item._id.should.not.be.null
      res.body.resources.should.deep.equal([{"id":"1","quantity":5}])
    })
    .end(done)
  })


})