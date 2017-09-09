module.exports = function(supertest) {
  return {
    jsonAuthPost:function(url,token,body) {
      return supertest.post(url)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
    }  
  }
}