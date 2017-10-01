let mongoose = require('mongoose');
let avatarSchema = require("./Avatar").schema;
let activitySchema = require("./Activity").schema;
let itemSchema = require("./AvatarItem").schema;
let modSchema = require("./ItemMod").schema;

let userSchema = new mongoose.Schema({
  _id: String,
  password: String,
  email: String,
  fbid: String,
  avatars:[avatarSchema],
  activities:[activitySchema],
  items:[itemSchema], //Unassigned items
  gems:[modSchema],
  resources:[{
    id:String,
    quantity:Number,
    _id:false
  }],
  realms:[{
    elementId:String,
    maximumLevel:Number,
    _id:false
  }] 
});

userSchema.methods.avatarActivity = function(avatarId) {
  for (a of this.activities) {
    if (a.avatarId == avatarId) {
      return a;
    }
  }
  return null;
};

userSchema.methods.findAvatar = function(avatarId) {
  return this.avatars.find((a) => a._id == avatarId)
};

userSchema.methods.findActivity = function(activityId) {
  return this.activities.find( (a) => a._id == activityId)
};

userSchema.methods.findRealm = function(elementId) {
  return this.realms.find( (r) => r.elementId == elementId)
};

userSchema.methods.findItem = function(itemId) {
  return this.items.find( (x) => x._id == itemId )
};

userSchema.methods.findGem = function(gemId) {
  return this.gems.find( (x) => x._id === gemId )
};

userSchema.methods.addItem = function(item) {
  this.items.push(item)
};

userSchema.methods.removeItem = function(itemId) {
  let item = this.findItem(itemId);
  this.items = this.items.filter( (x) => x._id != itemId );
  return item
};

userSchema.methods.removeGem = function(gemId) {
  let gem = this.findGem(gemId)
  this.gems = this.gems.filter( (x) => x._id != gemId );
  return gem
};

userSchema.methods.removeActivity = function(activityId) {
  this.activities = this.activities.filter((a) => a._id != activityId)
};

userSchema.methods.resourceCount = function(resourceId) {
  let found = this.resources.find( (r) => r.id == resourceId)
  return found ? found.quantity : 0
};

userSchema.methods.hasResources = function(resourceList) {
  if(!resourceList) {
    return true;
  }
  for (r of resourceList) {
    let count = this.resourceCount(r.id);
    if (count < r.quantity) {
      return false
    }
  }
  return true
};

userSchema.methods.addResource = function(resource) {
  let found = this.resources.find( (r) => r.id == resource.id);
  if (found) {
    found.quantity += resource.quantity
  } else {
    this.resources.push(resource)
  }
};

userSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj
};

module.exports = {
  schema: userSchema,
  model: mongoose.model('User',userSchema)
};