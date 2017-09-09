const cred = require("../config/credentials")
const jwt = require('jsonwebtoken');
const User = require("../../model").User

const expiry = 60*60*24;

function findUser(req,res,next) {
  User.findOne({_id:req.decodedToken.userid}).then(user => {
    if (!user) {
      console.log("Could not find user with id " + decoded)
    }
    req.user = user
    next()
  })
}

const decodeToken = function(req,res,next) {
  var token = req.get("Authorization");
  if (token) {
    token = token.replace("Bearer ","")
    const decoded = jwt.decode(token,cred.secret)
    req.decodedToken = decoded
    findUser(req,res,next)
  } else {
    next()  
  }
} 

const getAuthToken = function (req,res,next) {
  var token = req.get("Authorization");
  if (token) {
    token = token.replace("Bearer ","")
    try {
      req.decodedToken = jwt.verify(token, cred.secret);
      findUser(req,res,next)
    } catch (err) {
      if(err.name == "TokenExpiredError") {
        console.log(token)
        console.log("Token has expired " + err.expiredAt)
      } else {
        console.log(err)  
      }
      next()
    }
  } else {
    next()  
  }
}

var generate = function(user) {  
  return generateId(user._id)
}

var generateId = function(userId) {  
  var token = jwt.sign({
    userid: userId
  }, cred.secret, {
    expiresIn: expiry
  })
  var exp = jwt.verify(token, cred.secret).exp;
  return {token:token,expiry:exp};
}

module.exports = {
  getAuthToken: getAuthToken,
  generateToken: generate,
  generateTokenId: generateId,
  decodeToken: decodeToken
}