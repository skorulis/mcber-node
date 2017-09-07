const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8'));

module.exports = {
  skills
}