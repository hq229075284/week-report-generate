const moment = require('moment')
const staticConfig = require('../staticConfig')
const path = require('path')
const fs = require('fs')

module.exports.getCurrentWeekDuration = () => {
  const format = 'YYYY-MM-DD'
  let startDate, endDate
  let weekNum = moment().day()
  if (moment().day() === 0) weekNum += 7
  startDate = moment().day(1 - weekNum)
  endDate = moment().day(5 - weekNum)
  return `${startDate.format(format)}~${endDate.format(format)}`
}

module.exports.createDefaultParams = () => ({
  ...staticConfig,
  time: module.exports.getCurrentWeekDuration()
})

module.exports.tryCreateDirWhenNecessary = (dirPath) => {
  const { platform } = process
  switch (platform) {
    case 'win32': {
      const multiDir = dirPath.split('\\')
      const root = multiDir.shift()
      tryCreateDir(multiDir, root)
      break
    }
    case 'linux': {
      const multiDir = dirPath.split('/').filter(a => !!a)
      const root = '/'
      tryCreateDir(multiDir, root)
      break
    }
  }
}

function isExistDir(p) {
  const isExist = fs.existsSync(p)
  if (isExist) {
    return fs.statSync(p).isDirectory()
  }
  return isExist
}

function tryCreateDir(multiDir, root) {
  let p = root
  while (multiDir.length > 0) {
    p = path.join(p, multiDir.shift())
    if (!isExistDir(p)) {
      fs.mkdirSync(p)
    }
  }
}

module.exports.createDefaultFileName = function (config) {
  if (config.fileName) {
    return config.fileName.replace(/([^\\]?){([^}]*)([^\\])}/g, function ($0, $1, $2, $3) {
      return $1 + eval($2 + $3)
    }).replace(/\\({|})/g, '$1')
  }
  return '你为啥不配置filename'
}