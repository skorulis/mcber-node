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
  constants.usedSkills.should.deep.equal(["0","102"])
});

it("Creates an item",function() {
    let avatar = gen.emptyAvatar();
    let itemRef = ref.baseItems.atIndex(1);
    let constants = craft.initialValues(itemRef, avatar);
    constants.skillLevel.should.equal(0);
    constants.duration.should.equal(23);
    constants.usedSkills.should.deep.equal(["7","102"]);
    let result = craft.getResult(itemRef,avatar,constants);
    let xp1 = result.experience[0];
    xp1.xp.should.equal(23);
    result.item.id.should.be.a("String")
});

it("Creates an activity", function() {
    let avatar = gen.emptyAvatar();
    let itemRef = ref.baseItems.atIndex(1);
    let activity = craft.getActivity(itemRef,avatar);
    activity.activityType.should.equal("craft");
    activity.calculated.duration.should.equal(23);
    activity.itemId.should.equal(itemRef.name);
    activity.avatarId.should.equal(avatar._id)
});