var http = require('http')
var fs = require('fs')
var path = require('path')
var config = require('./staticConfig')

module.exports.download = function () {
  return new Promise(resolve => {
    http.get({
      port: '3000',
      path: '/api/getTemplate',
    }, function (result) {
      const w = fs.createWriteStream(path.resolve(process.cwd(), config.templatePath))
      result.pipe(w)
      w.on('end', (err) => {
        if (err) {
          console.log(err)
          return
        }
        resolve()
      })
    })
  })
}

module.exports.upload = function (filePath) {
  return new Promise(resolve => {
    const buffer = fs.readFileSync(filePath)
    // const formData = new FormData()
    // formData.append('file', buffer)
    // var boundaryKey = '----' + new Date().getTime();
    const req = http.request({
      method: 'post',
      port: '3000',
      path: '/api/upload',
      // headers: { contentType: 'multipart/form-data; boundary=' + boundaryKey }
    }, function (res) {
      console.log(123)
    })
    req.write(buffer, () => {
    })
    req.end()
  })
}
