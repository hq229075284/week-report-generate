const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const KRouter = require('koa-router')
// var bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')
const config = require('./config')

const app = new Koa()
const router = new KRouter()

app.use(async (ctx, next) => {
  await next()
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
})

app.use(koaBody({
  multipart: true,
  formLimit: 100 * 1024 * 1024,
  formidable: {
    uploadDir: config.fileStoreDir
  }
}))

router.post('/api/upload', (ctx, next) => {
  // const { filename } = ctx.request.body
  const { path: _path, name } = ctx.request.files.file
  // console.log(filename, path)
  const renamePath = config.fileStoreDir + name
  const isExistSameName = fs.existsSync(renamePath)
  let timestamp = ''
  if (isExistSameName) {
    timestamp = (new Date()).valueOf() + '-'
  }
  fs.renameSync(_path, path.resolve(config.fileStoreDir, timestamp + name))
  ctx.body = JSON.stringify('success')
})

router.get('/api/getTemplate', (ctx, next) => {
  const buffer = fs.readFileSync(config.templatePath)
  ctx.body = buffer
  // ctx.set({
  //   'Content-Type': 'application/force-download',
  //   'Content-Disposition': 'attachment; filename=week.md'
  // })
})

app.use(router.routes())
console.log(23)
// app.use(router.allowedMethods())

const port = config.port || 3000
app.listen(port, function () { console.log(`listen at ${port}`) })