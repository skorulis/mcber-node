const controllers = require('../controllers');
const auth = require("../auth/authHelpers.js")
const validate = require('express-jsonschema').validate

module.exports = (app,passport) => {
	app.get('/api/user/current',passport.authenticate("jwt-verify"), controllers.user.current);
  app.post('/api/user/update',passport.authenticate("jwt-verify"),controllers.user.update);
  app.post('/api/user/refreshToken',auth.decodeToken, controllers.user.refreshToken);

  app.post('/api/login/fb',passport.authenticate('facebook-token'),controllers.user.loginComplete);
  app.post('/api/login/password',passport.authenticate('local-login'),controllers.user.loginComplete);
  app.post('/api/signup',passport.authenticate('local-signup'), controllers.user.signup);

  app.post('/api/action/explore',passport.authenticate("jwt-verify"), validate({body:controllers.action.exploreSchema}),  controllers.action.explore);
  app.post('/api/action/craft',validate({body:controllers.action.craftSchema}), passport.authenticate("jwt-verify"),  controllers.action.craft);

  app.post('/api/action/cancel',passport.authenticate("jwt-verify"), validate({body:controllers.action.cancelCompleteSchema}),  controllers.action.cancel)
  app.post('/api/action/complete',passport.authenticate("jwt-verify"), validate({body:controllers.action.cancelCompleteSchema}),  controllers.action.complete)

  app.post('/api/item/assign',passport.authenticate("jwt-verify"), validate({body:controllers.item.assignItemSchema}),  controllers.item.assignItem)
  app.post('/api/item/breakdown',passport.authenticate("jwt-verify"), validate({body:controllers.item.breakdownSchema}),  controllers.item.breakdownItem)
  

  app.get('/api/*', function(req, res) {
    res.status(404).send({message:"404 for " + req.method + " at " + req.originalUrl})  
  });

  app.post('/api/*', function(req, res) {
    res.status(404).send({message:"404 for " + req.method + " at " + req.originalUrl})  
  });

}