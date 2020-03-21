const projectPath = process.argv[2]

// console.log(`${projectPath}/gantreeInventory.json`)

const f = require(`${projectPath}/gantreeInventory.json`)

process.stdout.write(JSON.stringify(f))
