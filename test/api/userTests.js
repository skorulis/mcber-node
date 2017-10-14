process.env.NODE_ENV = "test";
let app = require("../../app")("mongodb://localhost:27017/mcberTest1");
let supertest = require("supertest")(app);
const helpers = require("../testHelpers")(supertest);

let token = null;

describe("User tests", function() {
  before(function(done){
    helpers.createNewUser("userTests@test.com",function(user,tkn) {
      token = tkn.token;
      token.should.be.a("string");
      user.save((err,user) => {
        done()
      });
    })
  });

  it("Sets user options",function(done) {
    let body = {"options":[{"optionName":"opt1","optionValue":"123"},{"optionName":"opt2","optionValue":10}]};
    helpers.jsonAuthPost("/api/user/setOptions",token)
      .send(body)
      .expect(helpers.checkStatusCode(200))
      .expect(function(res) {
        let options = res.body.user.options;
        options.should.be.a("array");
        options[0].optionName.should.equal("opt1");
        options[0].optionValue.should.equal("123");
        options[1].optionName.should.equal("opt2");
        options[1].optionValue.should.equal(10);


      })
      .end(done)
  });


});