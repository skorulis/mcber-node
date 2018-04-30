process.env.NODE_ENV = "test";
let chai = require('chai');
const assert = chai.assert;
let should = chai.should();
let app = require("../../app")("mongodb://localhost:27017/mcberTest1");
let supertest = require("supertest")(app);
var auth = require("../../server/auth/authHelpers");
const User = require("../../model").User;

let createdId = null;

it("Creates a user", function(done) {
  supertest.post("/api/signup")
  .send({"email":"email1@test.com",password:"dummy"})
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .set('Accept', 'application/json')
  .expect(200)
  .expect(function(res) {
    createdId = res.body.user._id
    res.body.user.email.should.equal("email1@test.com")
  })
  .end(done)
});

it("Logs in", function(done) {
  supertest.post("/api/login/password")
  .send({"email":"email1@test.com",password:"dummy"})
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .set('Accept', 'application/json')
  .expect(200)
  .expect(function(res) {
    assert(res.body.user.password == null)
    res.body.user.email.should.equal("email1@test.com")
  })
  .end(done)
});

it("Gets current user",function(done) {
  createdId.should.not.be.null
  let authJWT = auth.generateTokenId(createdId).token
  supertest.get("/api/user/current")
  .set('Accept', 'application/json')
  .set('Authorization', 'Bearer ' + authJWT)
  .expect(200)
  .expect(function(res) {
    res.body.user.email.should.equal("email1@test.com")
  })
  .end(done)
});

it("refreshes a token", function(done) {
  const authId = auth.generateTokenId(createdId).token
  supertest.post("/api/user/refreshToken")
  .set("Authorization","Bearer " + authId)
  .set('Accept', 'application/json')
  .expect(200)
  .expect(function(res) {
    res.body.auth.token.should.not.be.null
    res.body.user.should.not.be.null
  })
  .end(done)
})