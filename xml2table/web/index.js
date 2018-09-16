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
const trimTail = (str) => str.replace(/^\n|\n$/g, '')

document.getElementsByTagName('button')[0].addEventListener('click', function (e) {
  try {
    document.getElementById('output').value = ''
    const xmlStr = document.getElementById('input').value
    const result = convert.xml2js(xmlStr, { compact: true })

    const group = {}
    result.rss.channel.item.map(one => {
      const a = ({
        key: trimTail(one.key._text),
        link: trimTail(one.link._text),
        project: trimTail(one.project._text),
        resolution: trimTail(one.resolution._text),
        title: trimTail(one.title._text),
        summary: trimTail(one.summary._text),
        version: trimTail(one.version._text),
        type: trimTail(one.type._text),
      })

      if (group[one.project._text]) {
        group[one.project._text].push(a)
      } else {
        group[one.project._text] = [a]
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