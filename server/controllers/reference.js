const fs = require('fs');
const ref = require("../../calc/reference")

module.exports = {
  skills:function(req,res) {
    var obj = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8'));
    for(e of obj.elements) {
      e.totalAttack = e.damageModifiers.reduce((total,amount) => total + amount )
      e.totalDefense = obj.elements.reduce( (total,element) => {return total + element.damageModifiers[e.index]},0)
    }
    const helpers = {
      percent:function(fraction) { return fraction * 100 + "%"},
      colorClass:function(fraction) {
        return "v" + (fraction * 100)
      }
    }
    res.render('skills',{skills:obj,helpers,helpers})
  }
}