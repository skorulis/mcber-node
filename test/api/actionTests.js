process.env.NODE_ENV = "test";
let chai = require('chai');
const assert = chai.assert;
let should = chai.should();
let app = require("../../app")("mongodb://localhost:27017/mcberTest1");
let supertest = require("supertest")(app);
let auth = require("../../server/auth/authHelpers");
let User = require("../../model").User;
let helpers = require("../testHelpers")(supertest);
let rand = require("../../calc/rand");

let token = null;
let avatar = null;
let activity = null;
let savedItem = null;
let savedGem = null;

describe("Performs all action methods",function() {
  before(function(done){
    helpers.createNewUser("action@test.com",function(user,tkn) {
      token = tkn.token;
      token.should.be.a("string");
      user.addResource({"id":"1",quantity:5});
      user.addResource({"id":"16",quantity:14});
      user.addResource({"id":"19",quantity:3});
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
      console.log(res.body);
      let xp = res.body.result.experience[0];
      xp.xp.should.equal(40);
      let res1 = res.body.result.resources[0]
      res1.quantity.should.equal(1)
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

  it("Estimates crafting", function(done) {
    let body = {avatarId:avatar._id,itemId:"Sword",estimateOnly:true};
    helpers.jsonAuthPost("/api/action/craft",token,body)
      .expect(helpers.checkStatusCode(200))
      .expect(function(res) {
        res.body.estimate.should.equal(true);
        res.body.activity.calculated.resources.should.deep.equal([{id:"1",quantity:5}])
      })
      .end(done)
  });

  it("Starts crafting", function(done) {
  token.should.be.a("string");
  let body = {avatarId:avatar._id,itemId:"Sword"};
  helpers.jsonAuthPost("/api/action/craft",token,body)
    .expect(helpers.checkStatusCode(200))
    .expect(function(res) {
      activity = res.body.activity;
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
        savedItem = res.body.result.item;
        res.body.result.item.refId.should.equal("Sword");
        let xp = res.body.result.experience[0];
        xp.xp.should.equal(69);
        assert(!res.body.result.resource);
      })
      .end(done)
    });

  it("Starts gem crafting",function(done) {
    let body = {avatarId:avatar._id,modId:"+health",level:2};
    helpers.jsonAuthPost("/api/action/craftGem",token,body)
      .expect(helpers.checkStatusCode(200))
      .expect(function(res) {
        activity = res.body.activity;
        activity.activityType.should.equal('craft gem');
        activity.calculated.duration.should.equal(150);
        let r1 = activity.calculated.resources[0];
        r1.id.should.equal("16");
        r1.quantity.should.equal(14);
        activity.gem.modId.should.equal("+health");
        activity.gem.level.should.equal(2);
      })
      .end(done)
  });

  it("Completes gem crafting", function(done) {
    helpers.jsonAuthPost("/api/action/complete",token,{activityId:activity._id})
      .expect(helpers.checkStatusCode(200))
      .expect(function(res) {
        savedGem = res.body.result.gem;
        res.body.result.gem._id.should.be.a("string");
        res.body.result.gem.refId.should.equal("+health");
        res.body.result.gem.power.should.equal(2);
        let xp = res.body.result.experience[0];
        xp.xp.should.equal(150); //TODO: Should be more due to higher level item
        assert(!res.body.result.resource);
      })
      .end(done)
  });

  it("Starts socketing ",function(done) {
    let body = {avatarId:avatar._id,itemId:savedItem._id,gemId:savedGem._id};
    helpers.jsonAuthPost("/api/action/socketGem",token,body)
      .expect(helpers.checkStatusCode(200))
      .expect(function(res) {
        activity = res.body.activity;
        activity.activityType.should.equal('socket gem');
        activity.socketGem.itemId.should.equal(savedItem._id);
        activity.socketGem.gemId.should.equal(savedGem._id);
        activity.calculated.failureChance.should.equal(1);
        console.log(activity);

      })
      .end(done)
  });

  it("Completes socketing", function(done) {
    rand.setNextDouble(2);
    helpers.jsonAuthPost("/api/action/complete",token,{activityId:activity._id})
      .expect(helpers.checkStatusCode(200))
      .expect(function(res) {
        console.log(res.body.result);

        let item = res.body.result.item;
        item._id.should.be.a("string");
        item.mods.length.should.equal(1);
        item.level.should.equal(2);


        let xp = res.body.result.experience[0];
        xp.xp.should.equal(30);
        assert(!res.body.result.resource);
      })
      .end(done)
  });

});

