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

describe.only("Performs all action methods",function() {
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
    supertest.post("/api/action/explore")
    .send({realm:realm,avatarId:avatar._id})
    .end(done)
  })
})

