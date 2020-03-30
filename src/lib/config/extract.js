async function getProjectName(gantreeConfigObj) {
  return gantreeConfigObj.metadata.project
}

module.exports = {
  projectName: getProjectName
}
