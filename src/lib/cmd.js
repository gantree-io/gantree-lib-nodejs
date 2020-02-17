const { Buffer } = require('buffer')
const { exec } = require('child_process')

module.exports = {
  exec: async (command, options = {}) => {
    return new Promise((resolve, reject) => {
      console.log(`[Gantree] Executing: ${command}, ${JSON.stringify(options)}`)
      const child = exec(command, options)
      if (options.detached) {
        child.unref()
        resolve(child.pid)
        return
      }
      let match = false
      let output = new Buffer.from('')

      child.stdout.on('data', data => {
        if (options.matcher && options.matcher.test(data)) {
          match = true
          child.kill('SIGTERM')
          resolve()
          return
        }
        output = Buffer.concat([output, Buffer.from(data)])
        if (options.verbose) {
          console.log(data.toString())
        }
      })

      child.stderr.on('data', data => {
        output = Buffer.concat([output, Buffer.from(data)])
        if (options.verbose) {
          console.log('[Gantree] Verbose output (stderr):')
          console.log(data.toString())
        }
      })

      child.on('close', code => {
        if (code !== 0 && !match) {
          console.log(
            `[Gantree] Execution failed with code ${code}: ${command}`
          )
          reject(new Error(code))
        } else {
          resolve(output)
        }
      })
    })
  }
}
