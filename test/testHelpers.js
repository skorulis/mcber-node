module.exports = function(supertest) {
  return {
    jsonAuthPost:function(url,token,body) {
      return supertest.post(url)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(body)
    },
    authGet:function(url,token) {
      return supertest.get(url)
      .set('Authorization', 'Bearer ' + token)
    }  
  }
}