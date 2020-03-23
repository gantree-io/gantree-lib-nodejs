async function writeForParsing(distinguishing_keyword, data_as_string) {
  console.log(`!!!${distinguishing_keyword} ==> ${data_as_string}`) // used for stdout reading, do not change to logger
}

this.writeForParsing = writeForParsing

module.exports = {
  writeForParsing
}
