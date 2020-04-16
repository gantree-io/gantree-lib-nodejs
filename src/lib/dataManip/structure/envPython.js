const util = require('util')

const exec = util.promisify(require('child_process').exec)

const getLocalPythonInterpreterPath = async () => {
  // get the python for current environment so we can pass it around ansible if needed
  let pythonLocalPython

  try {
    pythonLocalPython = await exec(
      'python -c "import sys; print(sys.executable)"'
    )
  } catch (e) {
    // console.warn('python 2 is a no-go')
  }

  pythonLocalPython = await exec(
    'python3 -c "import sys; print(sys.executable)"'
  )

  return pythonLocalPython.stdout.trim()
}

module.exports = {
  getInterpreterPath: getLocalPythonInterpreterPath
}
