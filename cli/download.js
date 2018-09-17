var http = require('http')
var fs = require('fs')

module.exports.download = function () {
  return new Promise(resolve => {
    http.get({
      port: '3000',
      path: '/api/getTemplate',
    }, function (result) {
      const w = fs.createWriteStream(__dirname + '/d/工作周报.md')
      result.pipe(w)
      resolve()
    })
  })
}

module.exports.download()