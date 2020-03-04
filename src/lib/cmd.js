const { Buffer } = require('buffer')
const { exec } = require('child_process')

const { Counter } = require('./counter')
const { returnLogger } = require('./logging')

const logger = returnLogger('cmd')

async function each_count(count, action_trigger_count) {
  if (count % action_trigger_count == 0) {
    process.stdout.write('.')
  }
}

module.exports = {
  exec: async (command, options = {}) => {
    const counter = new Counter(each_count, 5)
    return new Promise((resolve, reject) => {
      logger.info(`Executing: ${command}, ${JSON.stringify(options)}`)
      const child = exec(command, options)
      if (options.detached) {
        child.unref()
        resolve(child.pid)
        return
      }
      let match = false
      let output = new Buffer.from('')

      child.stdout.on('data', data => {
        counter.stop_counting()
        if (options.matcher && options.matcher.test(data)) {
          match = true
          child.kill('SIGTERM')
          resolve()
          return
        }
        output = Buffer.concat([output, Buffer.from(data)])
        if (options.verbose) {
          counter.count_until_false()
          // logger.info(`'${command}':`)
          process.stdout.write(data.toString())
        }
      })

      child.stderr.on('data', data => {
        output = Buffer.concat([output, Buffer.from(data)])
        if (options.verbose) {
          logger.error(
            `Execution failed for command '${command}': ${data.toString()}`
          )
        }
      })

      child.on('close', code => {
        if (code !== 0 && !match) {
          logger.error(`Execution failed with code ${code}: ${command}`)
          reject(new Error(code))
        } else {
          resolve(output)
        }
        counter.stop_counting()
      })
    })
  },
  writeParsableStdout: async (distinguishing_keyword, data_as_string) => {
    console.log(`!!!${distinguishing_keyword} ==> ${data_as_string}`) // used for stdout reading, do not change to logger
  }
}
