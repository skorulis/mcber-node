const rand = require("./rand")
const ref = require("./reference")

const initialValues = function(realm,avatar) {
  var skill = avatar.skills.elements[realm.element]
  return {
    tickFrequency: 30 * realm.level * realm.level / (skill + 1)
  }
}

module.exports = {
  initialValues
}