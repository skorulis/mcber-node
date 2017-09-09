const express = require('express');
const logger = require('morgan');
const template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade');
var exphbs  = require('express-handlebars');

const app = express();

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res, next) {
  try {
    var html = template({ title: 'Home' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

require('./server/routes/web.js')(app)

module.exports = function(db) {
  return app
}