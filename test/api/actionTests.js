process.env.NODE_ENV = "test"
var chai = require('chai');
const assert = chai.assert;
var should = chai.should();
var app = require("../../app")("mongodb://localhost:27017/mcberTest1");
var supertest = require("supertest")(app);
var auth = require("../../server/auth/authHelpers")
const User = require("../../model").User
const helpers = require("../testHelpers")(supertest)

var token = null;
var avatar = null;
var activity = null;

describe("Performs all action methods",function() {
  it("Sets up the user",function(done) {
    supertest.post("/api/signup")
    .send({"email":"action@test.com",password:"dummy"})
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .expect(function(res) {
      token = res.body.auth.token
      token.should.not.be.null
      avatar = res.body.user.avatars[0]
    })
    .end(done)
  })

  it("Complains about missing realm", function(done) {
    helpers.jsonAuthPost("/api/action/explore",token)
    .send({})
    .expect(400)
    .end(done)
  })

  it("Starts exploring", function(done) {
    token.should.not.be.null
    var realm = {element:0,level:1}
    helpers.jsonAuthPost("/api/action/explore",token)
    .send({realm:realm,avatarId:avatar._id})
    .expect(function(res) {
      activity = res.body.activity
      activity._id.should.not.be.null
      activity.avatarId.should.equal(avatar._id)
      activity.realm.should.not.be.null
      activity.startTimestamp.should.not.be.null
      assert(activity.startTimestamp <= activity.finishTimestamp)
    })
    .end(done)
  })

  it("Completes an activity", function(done) {
    helpers.jsonAuthPost("/api/action/complete",token)
    .send({activityId:activity._id})
    .expect(200)
    .expect(function(res) {
      console.log(res.body)
      var xp = res.body.result.experience[0]
      xp.xp.should.equal(30)
      res.body.result.resource.quantity.should.equal(1)
    })
    .end(done)
  })
})

