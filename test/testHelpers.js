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
    },
    checkStatusCode:function(code) {
      return function(res) {
        if (res.status == code) {
          return true
        }
        console.log(res.error);
        return false
      }
    }

  }
}