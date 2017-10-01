'use strict';
let Counter = require("./Counter");

class ResourceContainer {
  constructor(resourceList,refResources, refSkills,elementRef,multiplier) {
    this.originalList = resourceList;
    this.refResources = refResources;
    this.refSkills = refSkills;
    this.elementRef = elementRef;

    this.adjustedList = resourceList.map(function(resource) {
      if (resource.elementRarity) {
        for (r of elementRef.resources) {
          if (r.rarity === resource.elementRarity) {
            return {id:r.id,quantity:resource.quantity * multiplier}
          }
        }
      } else {
        return resource
      }
    });
  }

  skillAffiliation() {
    let counts = new Counter();
    for (r of this.adjustedList) {
      let resourceRef = this.refResources.withId(r.id);
      counts.add(resourceRef.skill,r.quantity);
    }

    let skillId = counts.maxValue().key;
    return this.refSkills.withId(skillId);
  }

  totalCost() {
    let total = 0;
    for (r of this.adjustedList) {
      let resourceRef = this.refResources.withId(r.id);
      total += r.quantity * resourceRef.rarity
    }
    return total
  }

  addOther(container) {
    let counter = new Counter();
    counter.addAll(this.adjustedList,"id","quantity");
    counter.addAll(container.adjustedList,"id","quantity");
    this.adjustedList = counter.asNamedArray("id","quantity");
  }
}

module.exports = ResourceContainer;