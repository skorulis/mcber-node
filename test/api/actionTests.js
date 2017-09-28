process.env.NODE_ENV = "test";
let chai = require('chai');
const assert = chai.assert;
let should = chai.should();
let app = require("../../app")("mongodb://localhost:27017/mcberTest1");
let supertest = require("supertest")(app);
let auth = require("../../server/auth/authHelpers");
let User = require("../../model").User;
let helpers = require("../testHelpers")(supertest);

let token = null;
let avatar = null;
let activity = null;

describe("Performs all action methods",function() {
  before(function(done){
    helpers.createNewUser("action@test.com",function(user,tkn) {
        token = tkn.token;
        token.should.be.a("string");
        user.addResource({"id":"1",quantity:5});
        avatar = user.avatars[0];
        user.save((err,user) => {
            done()
        });
    })
  });

  it("Complains about missing realm", function(done) {
    helpers.jsonAuthPost("/api/action/explore",token)
    .send({})
    .expect(400)
    .end(done)
  });

  it("Starts exploring", function(done) {
    token.should.be.a("string");
    let realm = {elementId:"0",level:1};
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
  });

  it("Can't craft fake items", function(done) {
    token.should.be.a("string");
    let body = {avatarId: avatar._id, itemId: "MAGIC SUPER SWORD!!"};
    helpers.jsonAuthPost("/api/action/craft", token, body)
      .expect(helpers.checkStatusCode(400))
      .end(done);
  });

  it("Starts crafting", function(done) {
  token.should.be.a("string");
  let body = {avatarId:avatar._id,itemId:"Sword"};
  helpers.jsonAuthPost("/api/action/craft",token,body)
    .expect(helpers.checkStatusCode(200))
    .expect(function(res) {
      activity = res.body.activity;
      console.log(activity);
      activity.activityType.should.equal("craft");
      activity._id.should.be.a("string");
      activity.avatarId.should.equal(avatar._id);
      activity.startTimestamp.should.be.a("number");
      activity.calculated.should.be.a("object");
      activity.calculated.duration.should.equal(69);
      activity.calculated.skillLevel.should.equal(0);
      activity.itemId.should.equal("Sword");
    })
    .end(done)
  });

  it("Completes crafting", function(done) {
    helpers.jsonAuthPost("/api/action/complete",token,{activityId:activity._id})
      .expect(helpers.checkStatusCode(200))
      .expect(function(res) {
        res.body.result.item.name.should.equal("Sword");
        let xp = res.body.result.experience[0];
        xp.xp.should.equal(69);
        assert(!res.body.result.resource);
      })
      .end(done)
    });
});

