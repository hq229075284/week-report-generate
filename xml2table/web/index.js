import ejs from 'ejs'
import convert from 'xml-js'


const header = '|jiar名称|类型|\n|-|:-:|\n'
const tr = '|[<%=params.title%>](<%=params.link%>)|<%=params.type%>|\n'
const a = 1
function createList(list) {
  let renderStr = header

  return renderStr += list.reduce((prev, current) => {
    return prev + ejs.render(tr, { params: current })
  }, '')
}
const trimTail = (str = '') => str.replace(/^\n|\n$/g, '')

document.getElementsByTagName('button')[0].addEventListener('click', function (e) {
  try {
    document.getElementById('output').value = ''
    const xmlStr = document.getElementById('input').value
    const result = convert.xml2js(xmlStr, { compact: true })

    const group = {}
    result.rss.channel.item.map(one => {
      const a = {}
      try { a.key = trimTail(one.key._text) } catch (e) { a.key = '' }
      try { a.link = trimTail(one.link._text) } catch (e) { a.link = '' }
      try { a.project = trimTail(one.project._text) } catch (e) { a.project = '' }
      try { a.resolution = trimTail(one.resolution._text) } catch (e) { a.resolution = '' }
      try { a.title = trimTail(one.title._text) } catch (e) { a.title = '' }
      try { a.summary = trimTail(one.summary._text) } catch (e) { a.summary = '' }
      try { a.version = trimTail(one.version._text) } catch (e) { a.version = '' }
      try { a.type = trimTail(one.type._text) } catch (e) { a.type = '' }

      if (group[a.project]) {
        group[a.project].push(a)
      } else {
        group[a.project] = [a]
      }
    })

    const md = Object.entries(group).map(([key, list]) => {
      let section = `**[${key}]**\n`
      return section += createList(list)
    }).join('\n')

    document.getElementById('output').value = md
  } catch (e) {
    document.getElementById('output').value = '解析出错'
    throw e
  }
})