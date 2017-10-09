process.env.NODE_ENV = "test";
let chai = require('chai');
let should = chai.should();
let app = require("../../app")("mongodb://localhost:27017/mcberTest1");
let supertest = require("supertest")(app);
let auth = require("../../server/auth/authHelpers");
let User = require("../../model").User;
let helpers = require("../testHelpers")(supertest);
let rand = require("../../calc/rand");

let token = null;
let avatar = null;

describe("Instant action tests", function() {
  before(function(done){
    helpers.createNewUser("instant@test.com",function(user,tkn) {
      token = tkn.token;
      token.should.be.a("string");
      avatar = user.avatars[0];
      user.save((err,user) => {
        done()
      });
    })
  });

  it("Has a random battle",function(done) {
    let realm = {elementId:"0",level:1};
    helpers.jsonAuthPost("/api/action/battle",token)
      .send({realm:realm,avatarId:avatar._id})
      .expect(helpers.checkStatusCode(200))
      .expect(function(res) {
        let br = res.body.result.battleResult;
        br.should.be.a("object");
        br.a1TotalDamage.should.be.a("number");
        br.a2TotalDamage.should.be.a("number");
      })
      .end(done)
  });
});