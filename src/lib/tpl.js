const fs = require('fs-extra')
const Handlebars = require('handlebars')

Handlebars.registerHelper('raw', function(options) {
  return options.fn()
})

module.exports = {
  create: (source, target, data) => {
    const sourceTpl = fs.readFileSync(source).toString()
    const template = Handlebars.compile(sourceTpl)
    const contents = template(data)
    fs.writeFileSync(target, contents)
  }
}
