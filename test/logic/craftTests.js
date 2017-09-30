const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate");
const craft = require("../../calc/craft");
const ref = require("../../calc/reference");
const rand = require("../../calc/rand");
const update = require("../../calc/update");
const ResourceContainer = require("../../util/ResourceContainer");

it("Picks the item skill", function() {
  let itemRef = ref.baseItems.atIndex(0);
  let resources = new ResourceContainer(itemRef.resources,ref.resources,ref.skills,null,1);
  let skill = resources.skillAffiliation();
  skill.id.should.equal('0');

  itemRef = ref.baseItems.atIndex(4);
  resources = new ResourceContainer(itemRef.resources,ref.resources,ref.skills,null,1);
  skill = resources.skillAffiliation();
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

it("Creates and completes an activity", function() {
    let avatar = gen.emptyAvatar();
    let itemRef = ref.baseItems.atIndex(1);
    let activity = craft.getActivity(itemRef,avatar);
    activity.activityType.should.equal("craft");
    activity.calculated.duration.should.equal(23);
    activity.itemId.should.equal(itemRef.name);
    activity.avatarId.should.equal(avatar._id);

    let result = craft.completeActivity(activity,avatar);
    result.item.id.should.be.a("String");
    result.item.name.should.equal("Club");
});

it("Calculated gem initial values", function() {
  let avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,11,7,15,0]);

  let modRef = ref.mods.atIndex(0);
  let element = ref.skills.atIndex(1);
  let initial = craft.initialGemValues(modRef,1,element,avatar);
  initial.resources.should.deep.equal([{id:"4",quantity:5}]);
  initial.skillLevel.should.equal(26);
  initial.duration.should.equal(3);
  initial.usedSkills.should.deep.equal(["1","102"]);

  initial = craft.initialGemValues(modRef,2,element,avatar);
  initial.resources.should.deep.equal([{id:"4",quantity:15}]);
  initial.duration.should.equal(10);
});