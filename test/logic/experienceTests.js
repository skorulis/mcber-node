const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate");
const xp = require("../../calc/experience");

it("Adds Experience", function() {
  let avatar = gen.emptyAvatar();
  xp.addExperience(avatar,{xp:25,skillId:"0"});
  avatar.skills[0].level.should.equal(0);
  avatar.findSkill("0").xp.should.equal(25);
  avatar.findSkill("0").xpNext.should.equal(50);
  xp.addExperience(avatar,{xp:25,skillId:"0"});
  avatar.findSkill("0").level.should.equal(1);
  avatar.findSkill("0").xp.should.equal(0);
  avatar.findSkill("0").xpNext.should.equal(141);

//level 2 requires 141, 3 requires 259 = 400 total
  xp.addExperience(avatar,{xp:450,skillId:"0"});
  avatar.findSkill("0").level.should.equal(3);
  avatar.findSkill("0").xp.should.equal(50);
  avatar.findSkill("0").xpNext.should.equal(400)
});