const convert = require('xml-js')
const fs = require('fs')
const ejs = require('ejs')
const { header, tr } = require('../template/table.md')

const xmlStr = fs.readFileSync('./template/jira.xml', { encoding: 'utf8' })

const result = convert.xml2js(xmlStr, { compact: true })

const group = {}

result.rss.channel.item.map(one => {
  const a = ({
    key: one.key._text,
    link: one.link._text,
    project: one.project._text,
    resolution: one.resolution._text,
    title: one.title._text,
    summary: one.summary._text,
    version: one.version._text,
    type: one.type._text,
  })
  if (group[one.project._text]) {
    group[one.project._text].push(a)
  } else {
    group[one.project._text] = [a]
  }
})

function createList(list) {
  let renderStr = header

  return renderStr += list.reduce((prev, current) => {
    return prev + ejs.render(tr, { params: current })
  }, '')
}

const md = Object.entries(group).map(([key, list]) => {
  let section = `[${key}]\n`
  return section += createList(list)
}).join('')

console.log(md)