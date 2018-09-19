var http = require('http')
var fs = require('fs')
var path = require('path')
var config = require('./staticConfig')
var request = require('request')

module.exports.download = function () {
  return new Promise(resolve => {
    http.get({
      port: '3000',
      path: '/api/getTemplate',
    }, function (result) {
      const r = result
      const w = fs.createWriteStream(path.resolve(process.cwd(), config.templatePath))
      r.pipe(w)
      debugger
      r.on('end', (err) => {
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
    const readFileStream = fs.createReadStream(filePath)

    const formData = {
      file: readFileStream
    }
    request.post({
      url: 'http://localhost:3000/api/upload',
      formData: formData
    }, (err, httpResponse, body) => {
      if (err) {
        throw err
        // return console.error('upload failed:', err);
      }
      resolve()
      // console.log('Upload successful!  Server responded with:', body);
    });
    // const req = http.request({
    //   method: 'post',
    //   port: '3000',
    //   path: '/api/upload',
    //   headers: { 'content-type': 'multipart/form-data;' }
    // }, function (res) {
    //   res.on('end', () => {
    //     console.log(123)
    //     resolve()
    //   })
    // })
    // readFileStream.pipe(req)
    // req.end()
  })
}
