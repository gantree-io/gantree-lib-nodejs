const { Buffer } = require('buffer')
const child_process = require('child_process')
const { Counter } = require('./counter')
const opt = require('./utils/options')
const { returnLogger } = require('./logging')

const logger = returnLogger('cmd')

async function each_count(count, action_trigger_count) {
  if (count % action_trigger_count == 0) {
    process.stdout.write('.')
  }
}

function execPromiseCallback(resolve, reject, command, counter, _options = {}) {
  const verbose = opt.default(_options.verbose, true)
  const returnStdoutOnly = opt.default(_options.returnStdoutOnly, false)

  const child = child_process.exec(command, _options)

  // TODO: evaluate if this is worth re-implementing
  // if (options.detached) {
  //   child.unref()
  //   resolve(child.pid)
  //   return
  // }
  // let match = false

  let outputBuffer = new Buffer.from('')
  let stdoutOnly = new Buffer.from('')

  function addToOutputBuffer(data) {
    outputBuffer = Buffer.concat([outputBuffer, Buffer.from(data)])
  }

  function addToStdoutOnlyBuffer(data) {
    stdoutOnly = Buffer.concat([stdoutOnly, Buffer.from(data)])
  }

  child.stdout.on('data', data => {
    stdoutCallback(
      data,
      addToOutputBuffer,
      addToStdoutOnlyBuffer,
      counter,
      verbose
    )
  })

  child.stderr.on('data', data => {
    stderrCallback(data, addToOutputBuffer, command, verbose)
  })

  child.on('close', code => {
    childCloseCallback(
      code,
      resolve,
      reject,
      outputBuffer,
      stdoutOnly,
      command,
      counter,
      returnStdoutOnly
    )
  })
}

function stdoutCallback(
  data,
  addToOutputBuffer,
  addToStdoutOnlyBuffer,
  counter,
  verbose
) {
  counter.stop_counting()
  // TODO: evaluate if this is worth re-implementing (needs documentation for developers possibly)
  // if (options.matcher && options.matcher.test(data)) {
  //   match = true
  //   child.kill('SIGTERM')
  //   resolve()
  //   return
  // }
  addToOutputBuffer(data)
  addToStdoutOnlyBuffer(data)
  if (verbose) {
    // logger.info(`'${command}':`)
    counter.count_until_false()
    process.stdout.write(data.toString())
  }
}

function stderrCallback(data, addToOutputBuffer, command, verbose) {
  addToOutputBuffer(data)
  if (verbose) {
    logger.error(
      `Error occured during command execution '${command}': \n${data.toString()}`
    )
  }
}

async function childCloseCallback(
  code,
  resolve,
  reject,
  outputBuffer,
  stdoutOnly,
  command,
  counter,
  returnStdoutOnly
) {
  // old conditional with match support
  // if (code !== 0 && !match) {

  // if non-zero exit code
  if (code !== 0) {
    logger.error(`Execution failed with code ${code}: ${command}`)
    await reject(new Error(code))
  }
  // if exit code is zero
  else {
    if (returnStdoutOnly === true) {
      resolve(stdoutOnly)
    } else {
      resolve(outputBuffer)
    }
  }
  await counter.stop_counting()
}

async function execCommand(command, _options = {}) {
  const returnCleanStdout = await opt.default(_options.returnCleanStdout, false)

  if (returnCleanStdout !== true) {
    logger.info(`Executing: ${command}, ${JSON.stringify(_options)}`)
  }

  const counter = new Counter(each_count, 5)

  return new Promise(async (resolve, reject) => {
    execPromiseCallback(resolve, reject, command, counter, _options)
  })
}

module.exports = {
  exec: execCommand
}
