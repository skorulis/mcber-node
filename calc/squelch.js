const itemCalc = require("./itemCalc");
const Counter = require("../util/Counter");

const squelchResult = function(user,result) {
  if (result.item) {
    if (user.getOption("item auto squelch level",-1) >= result.item.level) {
      result.addResources(itemCalc.breakdown(result.item));
      result.item = null;

    }
  }
  if (result.gem) {
    if (user.getOption("gem auto squelch level",-1) >= result.gem.power) {
      result.addResources(itemCalc.breakdownGem(result.gem));
      result.gem = null;
    }
  }
};

module.exports = {
  squelchResult
};