#!/usr/bin/env node
const { createDefaultParams, tryCreateDirWhenNecessary } = require('./utils')
const { getPromptResult, inquireConflict } = require('./question')
const staticConfig = require('./staticConfig')

const yargs = require('yargs')
const argv = yargs
  .scriptName("wr")
  .command('new <createPath>', 'add new post',
    (yargs) => yargs.option('y', {
      type: 'boolean',
      describe: '所有询问选->是',
      default: false
    }).option('p', {
      type: 'boolean',
      describe: '从服务端拉取模板覆盖到本地的模板路径下的模板文件中',
    }),
    createNewPost)
  .command('deploy <mdPath>', '发布周报', (yargs) => yargs, deployMdToServer)
  .help('h')
  .alias('h', 'help')
  .locale('zh_CN')
  .argv

// 交互文件配置
async function createNewPost(_argv) {
  const { createPath, y, p } = _argv
  const path = require('path')
  const fs = require('fs')
  let params
  if (y) {
    params = createDefaultParams()
  } else {
    params = await getPromptResult()
  }
  const isPullTemplate = !!p
  const dirPath = path.resolve(process.cwd(), createPath)
  tryCreateDirWhenNecessary(dirPath)
  const filePath = path.join(dirPath, params.fileSuffix ? `${params.fileName}.${params.fileSuffix}` : params.fileName)

  const isExistThisFile = fs.existsSync(filePath)

  if (isExistThisFile) {
    try {
      fs.accessSync(filePath)
    } catch (e) {
      console.log('无访问权限')
      return
    }
    const { isForce } = await inquireConflict('此文件已存在，是否替换？')
    if (isForce) {
      createFileByTemplate(filePath, params, isPullTemplate)
    }
  } else {
    createFileByTemplate(filePath, params, isPullTemplate)
  }
}

// 创建文件
async function createFileByTemplate(filePath, params, isPullTemplate) {
  const ora = require('ora')
  const ejs = require('ejs')
  const fs = require('fs')
  const { download } = require('./download')
  debugger
  let spinner
  if (isPullTemplate) {
    spinner = ora('download template...').start()
    await download()
    console.log('download download download')
    spinner.text = 'read template...'
  } else {
    spinner = ora('read template...').start()
  }
  const template = fs.readFileSync(staticConfig.templatePath, { encoding: 'utf8' })
  spinner.text = 'compile template...'
  const md = ejs.render(template, { params })
  spinner.text = 'create file...'
  fs.writeFileSync(filePath, md)
  spinner.color = 'green'
  spinner.text = 'success'
  spinner.stop()
}

async function deployMdToServer(_argv) {
  const { upload } = require('./download')
  const { mdPath } = _argv
  const fs = require('fs')
  const path = require('path')
  const filePath = path.resolve(process.cwd(), mdPath)
  const isExistThisFile = fs.existsSync(filePath)
  if (isExistThisFile) {
    await upload(filePath)
    console.log('上传成功')
  } else {
    throw new Error('文件不存在')
  }
}
