const HandleBars = require('handlebars')
const fs = require('fs')

const loadFile = (file) => {
  const template = fs.readFileSync(__dirname + '/../templates/' + file)
  return template.toString()
}

const layout = HandleBars.compile(loadFile('index.hbs'))

// const view = (template, data={}) => {
//   // data.whichPartial = template
//   return layout
// }

module.exports = {
  view: layout
}
