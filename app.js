const express = require('express');
const logger = require('morgan');
const template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./server/auth/passport')(passport); 

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

mongoose.Promise = global.Promise
module.exports = function(dbURL) {
  mongoose.connect(dbURL,{useMongoClient: true});
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("Connect to database " + dbURL)
  });

  require('./server/routes/web.js')(app)
  require('./server/routes/api.js')(app,passport)
  return app
}