const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate");
const craft = require("../../calc/craft");
const ref = require("../../calc/reference");
const itemCalc = require("../../calc/item");
const rand = require("../../calc/rand");
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
    activity.itemId.should.equal(itemRef.id);
    activity.avatarId.should.equal(avatar._id);

    let result = craft.completeActivity(activity,avatar);
    result.item.id.should.be.a("String");
    result.item.refId.should.equal("Club");
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
  initial.resources.should.deep.equal([{id:"4",quantity:14}]);
  initial.duration.should.equal(9);
});

it("Crafts a gem",function() {
  let avatar = gen.emptyAvatar();
  let modRef = ref.mods.atIndex(0);
  let element = ref.skills.atIndex(1);
  let constants = craft.initialGemValues(modRef,1,element,avatar);
  constants.skillLevel.should.equal(0);
  constants.duration.should.equal(69);
  let result = craft.getGemResult(modRef,1,element,avatar,constants);
  let xp1 = result.experience[0];
  xp1.xp.should.equal(69);
  result.gem._id.should.be.a("String");
  result.gem.elementId.should.equal("1");
  result.gem.power.should.equal(1);

  let activity = craft.getGemActivity(modRef,1,element,avatar);
  activity.calculated.resources[0].id.should.equal("4");
  activity.calculated.resources[0].quantity.should.equal(5);
  activity.calculated.duration.should.equal(69);
  activity.activityType.should.equal("craft gem");

  let activityResult = craft.completeGemActivity(activity,avatar);
  activityResult.experience.should.deep.equal(result.experience);
  activityResult.gem._id.should.be.a("String");
  activityResult.gem.elementId.should.equal("1");
  activityResult.gem.power.should.equal(1);
});

it("Calculates socket initial values", function() {
  let avatar = gen.emptyAvatar();
  let gem = itemCalc.fixedMod(ref.mods.atIndex(1),1,null);
  let item = itemCalc.fixedItem(ref.baseItems.atIndex(0),[]);

  gem.refId.should.equal("+health");
  item.refId.should.equal("Sword");

  let initial = craft.initialSocketValues(item,gem,avatar);
  initial.skillLevel.should.equal(0);
  initial.failureChance.should.equal(1);
  initial.duration.should.equal(30);

  avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,11,7,15,0]);
  initial = craft.initialSocketValues(item,gem,avatar);
  initial.skillLevel.should.equal(11);
  initial.failureChance.should.be.closeTo(0.083333,0.001);
  initial.duration.should.equal(3);
});

it("Gets socket results", function() {
  let avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,1,7,15,0]);
  let gem = itemCalc.fixedMod(ref.mods.atIndex(1),1,null);
  let item = itemCalc.fixedItem(ref.baseItems.atIndex(0),[]);

  let initial = craft.initialSocketValues(item,gem,avatar);
  initial.skillLevel.should.equal(1);
  initial.failureChance.should.equal(0.5);
  initial.duration.should.equal(15);

  rand.setNextDouble(1);
  let result = craft.getSocketResult(item,gem,initial);
  result.experience.should.deep.equal([ { type: 'elemental', xp: 15, skillId: '102' } ])
  result.item.level.should.equal(1);
  result.item.mods.length.should.equal(1);

});