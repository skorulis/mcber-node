const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const gen = require("../../calc/generate");
const craft = require("../../calc/craft");
const ref = require("../../calc/reference");
const rand = require("../../calc/rand");
const update = require("../../calc/update");

it("Calculated initial values", function() {
  let avatar = gen.withLevels([10,15,0,0,0,0,0,0,0,0,0,11,7,15,0]);
  //var itemRef = ref
  //var constants = craft.initialValues(avatar);
});