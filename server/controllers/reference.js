var fs = require('fs');

module.exports = {
  skills:function(req,res) {
    var obj = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8'));
    var index = 0
    for(e of obj.elements) {
      e.totalDefence = 0
    }
    for(e of obj.elements) {
      e.totalAttack = e.damageModifiers.reduce((total,amount) => total + amount )
      e.totalDefense = obj.elements.reduce( (total,element) => {return total + element.damageModifiers[index]},0)

      index++;
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