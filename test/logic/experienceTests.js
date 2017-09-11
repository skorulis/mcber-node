const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate")
const xp = require("../../calc/experience")

it("Adds Experience", function() {
  var avatar = gen.emptyAvatar()
  xp.addExperience(avatar,{type:"elemental",xp:25,elementId:0})
  avatar.skills.elements[0].level.should.equal(0)
  avatar.skills.elements[0].xp.should.equal(25)
  xp.addExperience(avatar,{type:"elemental",xp:25,elementId:0})
  avatar.skills.elements[0].level.should.equal(1)
  avatar.skills.elements[0].xp.should.equal(0)

//level 2 requires 141, 3 requires 259 = 400 total
  xp.addExperience(avatar,{type:"elemental",xp:450,elementId:0})
  avatar.skills.elements[0].level.should.equal(3)
  avatar.skills.elements[0].xp.should.equal(50)

})