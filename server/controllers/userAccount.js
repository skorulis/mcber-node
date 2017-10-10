const auth = require('../auth/authHelpers');

module.exports = {
  loginComplete: function(req,res) {
    const obj = {status:"ok",auth:auth.generateToken(req.user),user:req.user};
    res.status(200).send(obj)
  },
  signup: function(req,res) {
    const obj = {status:"ok",auth:auth.generateToken(req.user),user:req.user};
    res.status(200).send(obj)
  },
  current: function(req,res) {
    const obj = {status:"ok",user:req.user};
    res.status(200).send(obj)
  },
  update: function(req, res) {
    const json = req.body;
    req.user.update({fullname:json.fullname}).then(() => {
      const obj = {status:"ok"};
      res.status(200).send(obj)  
    })
  },
  refreshToken: function(req,res) {
    const token = req.decodedToken;
    if(!req.decodedToken) {
      res.status(400).send({message:"Could not decode token"})
    } else if(!req.user) {
      res.status(400).send({message:"Could not find User"})
    } else {
      const obj = {status:"ok",auth:auth.generateToken(req.user),user:req.user};
      res.send(obj)
    }
  }

};