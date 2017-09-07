const controllers = require('../controllers');


module.exports = (app) => {
  app.get("/skills",controllers.reference.skills)
  app.get("/simulate",controllers.simulation.experiment1)
}