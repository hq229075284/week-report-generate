const moment = require('moment')
const staticConfig = require('../staticConfig')
const path = require('path')
const fs = require('fs')

var getCurrentWeekDuration = () => {
  const format = 'YYYY-MM-DD'
  let startDate, endDate
  if (moment().day() === 0) {
    startDate = moment().day(-6)
    endDate = moment().day(-2)
  } else {
    startDate = moment().day(1)
    endDate = moment().day(5)
  }
  return `${startDate.format(format)}~${endDate.format(format)}`
}

var createDefaultParams = () => ({
  ...staticConfig,
  fileName: createDefaultFileName({ ...staticConfig, time: getCurrentWeekDuration() }),
  time: getCurrentWeekDuration()
})

var tryCreateDirWhenNecessary = (dirPath) => {
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

var createDefaultFileName = function (config) {
  if (config.fileName) {
    return config.fileName.replace(/([^\\]?){([^}]*)([^\\])}/g, function ($0, $1, $2, $3) {
      return $1 + eval($2 + $3)
    }).replace(/\\({|})/g, '$1')
  }
  return '你为啥不配置filename'
}

module.exports = {
  getCurrentWeekDuration,
  createDefaultParams,
  tryCreateDirWhenNecessary,
  createDefaultFileName,
}