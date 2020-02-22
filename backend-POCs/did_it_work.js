const child_process = require("child_process")

// AVAILABLE ERROR CODES:
// 3 - 125
// 131 - 255 (FATAL)

function systemSync(cmd) {
    try {
        return child_process.execSync(cmd).toString();
    }
    catch (error) {
        error.status  // Might be 127 in your example.
        error.message // Holds the message you typically want.
        error.stderr  // Holds the stderr output. Use `.toString()`.
        error.stdout  // Holds the stdout output. Use `.toString()`.
        return error
    }
}

function detailed_print(result) {
    if (typeof result == "string") {
        console.log(result)
    } else if (typeof result == "object") {
        console.log("----ERROR!----")
        console.log("----STDOUT----")
        console.log(result.stdout.toString())
        console.log("----STDERR----")
        console.log(result.stderr.toString())
        console.log(`----EXIT CODE [ ${result.status.toString()} ]----`)
    }
}

function regular_print(result) {
    if (typeof result == "string") {
        console.log("SUCCESS")
    } else {
        console.log(`FAIL (EXIT_CODE=${result.status.toString()})`)
        console.log("----STDOUT----")
        console.log(result.stdout.toString())
    }
}

function simple_print(result) {
    if (typeof result == "string") {
        console.log("SUCCESS")
    } else {
        console.log(`FAIL (EXIT_CODE=${result.status.toString()})`)
    }
}




const result = systemSync('node . sync --config samples/config/cheap_aws.sample.json')

// detailed_print(result)
regular_print(result)
