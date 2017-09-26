process.env.NODE_ENV = "test";
let chai = require('chai');
const assert = chai.assert;
let should = chai.should();
let app = require("../../app")("mongodb://localhost:27017/mcberTest1");
let supertest = require("supertest")(app);
let auth = require("../../server/auth/authHelpers");
let User = require("../../model").User;
let helpers = require("../testHelpers")(supertest);

var token = null;
var avatar = null;
var activity = null;

describe("Performs all action methods",function() {
  it("Sets up the user",function(done) {
    supertest.post("/api/signup")
    .send({"email":"action@test.com",password:"dummy"})
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .expect(function(res) {
      token = res.body.auth.token;
      token.should.be.a("string");
      avatar = res.body.user.avatars[0]
    })
    .end(done)
  });

  it("Complains about missing realm", function(done) {
    helpers.jsonAuthPost("/api/action/explore",token)
    .send({})
    .expect(400)
    .end(done)
  });

  it("Starts exploring", function(done) {
    token.should.be.a("string");
    let realm = {elementId:0,level:1};
    helpers.jsonAuthPost("/api/action/explore",token)
    .send({realm:realm,avatarId:avatar._id})
    .expect(helpers.checkStatusCode(200))
    .expect(function(res) {
      activity = res.body.activity;
      activity._id.should.be.a("string");
      activity.avatarId.should.equal(avatar._id);
      activity.realm.should.be.a("object");
      activity.startTimestamp.should.be.a("number");
      activity.calculated.should.be.a("object");
      activity.calculated.duration.should.equal(30);
      activity.calculated.skillLevel.should.equal(0)
    })
    .end(done)
  });

  it("Completes an activity", function(done) {
    helpers.jsonAuthPost("/api/action/complete",token)
    .send({activityId:activity._id})
    .expect(200)
    .expect(function(res) {
      let xp = res.body.result.experience[0];
      xp.xp.should.equal(40);
      res.body.result.resource.quantity.should.equal(1)
    })
    .end(done)
  })
});

