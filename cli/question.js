const inquirer = require('inquirer')
const { getCurrentWeekDuration, createDefaultFileName } = require('./utils')
const staticConfig = require('./staticConfig')

function getPromptResult() {
  const prompt = inquirer.createPromptModule()
  return prompt([
    {
      type: 'input',
      name: 'fileName',
      message: '文件名：',
      default: createDefaultFileName({ ...staticConfig, time: getCurrentWeekDuration() }),
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

module.exports = {
  getPromptResult,
  inquireConflict
}