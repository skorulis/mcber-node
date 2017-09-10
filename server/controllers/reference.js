const fs = require('fs');
const ref = require("../../calc/reference")

module.exports = {
  skills:function(req,res) {
    const helpers = {
      percent:function(fraction) { return fraction * 100 + "%"},
      colorClass:function(fraction) {
        return "v" + (fraction * 100)
      }
    }
    res.render('skills',{skills:ref.skills,helpers,helpers})
  }
}