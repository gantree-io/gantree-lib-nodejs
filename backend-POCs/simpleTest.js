const { exec } = require('child_process')
const chalk = require('chalk')

// AVAILABLE ERROR CODES:
// 3 - 125
// 131 - 255 - FATAL

const runCliCommand = async (command, options = {}) => {
  return new Promise((resolve, reject) => {
    console.log(`[POC] Executing: ${command}, ${JSON.stringify(options)}`)

    const child = exec(command, options)

    let all_output = new Buffer.from('')
    let stderr_output = new Buffer.from('')

    child.stdout.on('data', data => {
      all_output = Buffer.concat([all_output, Buffer.from(data)])
      if (options.verbose) {
        process.stdout.write(data.toString())
      }
    })

    child.stderr.on('data', data => {
      all_output = Buffer.concat([all_output, Buffer.from(data)])
      stderr_output = Buffer.concat([stderr_output, Buffer.from(data)])
      if (options.verbose) {
        console.error(
          `[POC] Execution stderr: '${command}': ${data.toString()}`
        )
      }
    })

    child.on('close', code => {
      if (code !== 0) {
        console.log(chalk.red(stderr_output.toString()))
        reject(new Error(code))
      } else {
        resolve(all_output)
      }
    })
  })
}

async function run() {
  console.log('[POC] RUNNING...')
  try {
    await runCliCommand(
      'node . sync --config samples/config/cheap_aws.sample.json'
    )
    console.log('[POC] SUCCESS.')
  } catch (e) {
    console.log('[POC] FAIL.')
  }
}

run()
