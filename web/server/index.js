const Koa = require('koa')
const fs = require('fs')
const path = require('path')
// var bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')
var formidable = require('formidable')

const app = new Koa()
// app.use(bodyParser({
//   formLimit: 100 * 1024 * 1024
// }))
// app.use(koaBody({
//   multipart: true,
//   formLimit: 100 * 1024 * 1024
// }))

app.use(async (ctx, next) => {
  await next()
  ctx.set('Access-Control-Allow-Origin', ctx.origin)
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
  if (ctx.path === '/') {
    ctx.set('content-type', 'text/html')
    ctx.body = fs.readFileSync(path.join(__dirname, '../html/index.html'));
  }
})

app.use((ctx, next) => {
  if (ctx.path === '/upload') {
    // ctx.set('content-type', 'application/json')
    let body = Buffer.alloc(0)
    // console.log(ctx.request.body)
    // debugger
    // const v = Buffer.from(ctx.request.body).toString()
    // console.log(v)
    // debugger
    // return new Promise(resolve => {
    //   ctx.req.on('data', function (chunk) {
    //     debugger
    //     body = Buffer.concat([body, chunk])
    //   })

    //   ctx.req.on('end', function () {
    //     console.log("body:", body);
    //     console.log(Buffer.isBuffer(body))
    //     debugger
    //     resolve()
    //   })
    // })

    var form = new formidable.IncomingForm()
    form.parse(ctx.req, function (err, fields, files) {
      debugger
    })
  }
})

app.listen(3000)