const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate");
const craft = require("../../calc/craft");
const ref = require("../../calc/reference");
const rand = require("../../calc/rand");
const update = require("../../calc/update");

it("Picks the item skill", function() {
  let itemRef = ref.baseItems.atIndex(0);
  let skill = craft.itemSkillAffiliation(itemRef);
  skill.id.should.equal('0');

  itemRef = ref.baseItems.atIndex(4);
  skill = craft.itemSkillAffiliation(itemRef);
  skill.id.should.equal('7')

});

it("Calculated initial values", function() {
  let avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,11,7,15,0]);
  let itemRef = ref.baseItems.atIndex(0);
  let constants = craft.initialValues(itemRef, avatar);
  constants.skillLevel.should.equal(21);
  constants.duration.should.equal(3);
});