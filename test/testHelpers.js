const bCrypt = require('bcrypt-nodejs');
let auth = require("../server/auth/authHelpers");
let gen = require("../calc/generate");

const createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = function(supertest) {
  return {
    createNewUser:function(email,done) {
        user = gen.newUser();
        user.email = email;
        user.password = createHash("dummy");
        user.save((err,user) => {
            let token = auth.generateToken(user);
            done(user,token)
        })
    },
    jsonAuthPost:function(url,token,body) {
      return supertest.post(url)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(body)
    },
    authGet:function(url,token) {
      return supertest.get(url)
      .set('Authorization', 'Bearer ' + token)
    },
    checkStatusCode:function(code) {
      return function(res) {
        if (res.status == code) {
          return true
        }
        console.log(res.error);
        return new Error("Code mismatch")
      }
    }

  }
};