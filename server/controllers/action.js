
const exploreSchema = {
  type:'object',
  required:["realm","avatarId"],
  properties:{
    realm: {
      type:'object',
      required: ['element','level'],
      properties:{
        element:{type:'number'},
        level:{type:'number'}
      },
      avatarId: {type:"string"}
    }
  }
}

module.exports = {
  exploreSchema,
  explore:function(req,res) {
    var data = req.body
    res.send("Unimplemented")
  }
}