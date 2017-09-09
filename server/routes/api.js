const controllers = require('../controllers');
const auth = require("../auth/authHelpers.js")
const validate = require('express-jsonschema').validate

module.exports = (app,passport) => {
	app.get('/api/user/current',passport.authenticate("jwt-verify"), controllers.user.current)
  app.post('/api/user/update',passport.authenticate("jwt-verify"),controllers.user.update)
  app.post('/api/user/refreshToken',auth.decodeToken, controllers.user.refreshToken)

  app.post('/api/login/fb',passport.authenticate('facebook-token'),controllers.user.loginComplete)
  app.post('/api/login/password',passport.authenticate('local-login'),controllers.user.loginComplete)
  app.post('/api/signup',passport.authenticate('local-signup'), controllers.user.signup)

  app.post('/api/action/explore',passport.authenticate("jwt-verify"), validate({body:controllers.action.exploreSchema}),  controllers.action.explore)
}