#!/usr/bin/env node
const { getCurrentWeekDuration, createDefaultParams, tryCreateDirWhenNecessary } = require('./utils')
const staticConfig = require('./staticConfig')

const yargs = require('yargs')
const argv = yargs
  .command('new <createPath>', 'add new post',
    (yargs) => yargs.option('y', {
      type: 'boolean',
      describe: '所有询问选->是',
      default: false
    }),
    createNewPost)
  .argv
// .option('n', {
//   alias: 'new',
//   // demandOption: true,
//   describe: 'new [path]',
//   type: 'string'
// }).option('d', {
//   alias: 'deploy',
//   // demandOption: true,
//   describe: 'new [upload-path]',
//   type: 'string'
// }).argv

// console.log(argv)
const fs = require('fs')
async function createNewPost(_argv) {
  const { createPath, y } = _argv
  const path = require('path')
  const fs = require('fs')
  let params
  if (y) {
    params = createDefaultParams()
  } else {
    params = await getPromptResult()
  }
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
      createFileByTemplate(filePath, params)
    }
  } else {
    createFileByTemplate(filePath, params)
  }
}

// const ejs = require('ejs')
// const ora = require('ora')
function createFileByTemplate(filePath, params) {
  const ora = require('ora')
  const ejs = require('ejs')
  const fs = require('fs')

  const spinner = ora('read template...').start()
  const template = fs.readFileSync(staticConfig.templatePath, { encoding: 'utf8' })
  spinner.text = 'compile template...'
  const md = ejs.render(template, { params })
  spinner.text = 'create file...'
  fs.writeFileSync(filePath, md)
  spinner.color = 'green'
  spinner.text = 'success'
  spinner.stop()
}

function getPromptResult() {
  const inquirer = require('inquirer')
  const prompt = inquirer.createPromptModule()
  return prompt([
    {
      type: 'input',
      name: 'fileName',
      message: '文件名：',
      default: `${staticConfig.fileName}-${staticConfig.username}-${getCurrentWeekDuration()}`,
    }, {
      type: 'input',
      name: 'username',
      message: '作者：',
      default: staticConfig.username,
    }, {
      type: 'input',
      name: 'time',
      message: '时间：',
      default: getCurrentWeekDuration(),
    }
  ]).then(result => Object.assign({}, staticConfig, result))
}

function inquireConflict(message) {
  const inquirer = require('inquirer')
  const prompt = inquirer.createPromptModule()
  return prompt([
    {
      type: 'confirm',
      name: 'isForce',
      message,
      choices: ['Y', 'n'],
      default: 'n',
    }
  ])
}