const express = require('express');

const app = express();

app.use(express.static(__dirname + '/static'))

module.exports = app;