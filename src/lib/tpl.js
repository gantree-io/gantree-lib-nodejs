const fs = require('fs-extra');
const Handlebars = require('handlebars');
// const path = require('path');


Handlebars.registerHelper('raw', function (options) {
  return options.fn();
});

module.exports = {
  create: (source, target, data) => {
    const sourceTpl = fs.readFileSync(source).toString();
    const template = Handlebars.compile(sourceTpl);
    const contents = template(data);

    // console.log({data})

    // const targetDir = path.dirname(target);
    // console.log({source, target});
    // fs.rmdirSync(targetDir, {recursive: true});
    // fs.mkdirSync(targetDir, {recursive: true});

    // console.log(targetDir)
    fs.writeFileSync(target, contents);
  }
}
