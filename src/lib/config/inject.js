const defaults = require('../../static_data/gantree_config_defaults')

// function resolveMissingKey(realObject, defaultObject, key) {
//     // if the default object value is null
//     if (defaultObject[key] === null) {
//         // error
//         console.log("ERROR!")
//     }
//     // default object value IS NOT null
//     else {
//         // set real object value to default object value
//         realObject[key] = defaultObject[key]
//         // return real object
//         return realObject
//     }
// }

function defaultReducer(realObject, defaultObject, key, name) {
  console.log(`----REDUCING: ${name}`)
  console.log(`${realObject[key]} | VS | ${defaultObject[key]}`)

  // if real object is an object
  if (typeof realObject === 'object') {
    // if real object is a null object
    if (realObject === null) {
      // error: real object should never be a null
      console.log("realObject shouldn't be null, ever!!!")
      process.exit(-1)
    }
    // real object IS NOT a null object
    else {
      // for each entry in the default object
      for (const defaultEntry of Object.entries(defaultObject)) {
        // idk lol
        console.log(defaultEntry)
        const entry_key = defaultEntry[0]
        // const entry_value = defaultEntry[1]
        console.log(defaultObject[entry_key]) // another object to evaluate
        // if default object's key's value is a null object - real object's key's value must be defined
        if (defaultObject[entry_key] === null) {
          console.log('default value for this key is null')
          // if real object's key's value is undefined
          if (realObject[entry_key] === undefined) {
            // error - this key is required
            console.log(`❌missing required key!!! '${name}.${entry_key}'`)
            process.exit(-1)
          } else {
            // do nothing - key is defined
            console.log(`✅satisfied required key (${name}.${entry_key})`)
          }
        }
        // if the default object's key's value IS NOT a null object
        else {
          realObject[entry_key] = defaultReducer(
            realObject[entry_key],
            defaultObject[entry_key],
            entry_key,
            `${name}.${entry_key}`
          )
        }
      }
      // recursively call self?
    }
    // console.log("early exit")
    // process.exit(-1)
  }
  // real object is undefined
  else if (realObject === undefined) {
    // special handling
    console.log('realObject is undefined!')
    process.exit(-1)
  }
  // real object is something else
  else {
    // likely a value from recursion
    return realObject
    // console.log("realObject must be of type object!")
    // process.exit(-1)
  }

  return realObject

  // for (entry in Object.entries(realObject))
  //     // if the real object does have the key
  //     if (realObject.hasOwnProperty(key) === true) {
  //         // no action necessary
  //         return realObject
  //     }
  //     // key is missing on real object
  //     else {
  //         // handle missing key in real object
  //         realObject = resolveMissingKey(realObject, defaultObject, key)
  //         return realObject
  //     }
  // console.log("REEEEEE DON'T COME HERE")
  // process.exit(-1)
  // if (realObject.hasOwnProperty(key) === false) {
  //     console.log("MISSING KEY!")
  //     if (defaultObject.hasOwnProperty(key) === false) {
  //         console.log(`NO DEFAULT DEFINITION!: ${key}`)
  //         console.log(`Schema may be outdated!`)
  //         process.exit(-1)
  //     } else if (defaultObject[key] === null) {
  //         console.log(`REQUIRED KEY MISSING!: ${key}`)
  //         process.exit(-1)
  //     } else {
  //         console.log(`${realObject[key]} -> ${defaultObject[key]}`)
  //         return defaultObject[key]
  //     }
  // }
  // console.log("-")
  // console.log(defaultObject[key])
  // if (defaultObject[key] === null) {
  //     console.log("defaults to null")
  //     console.log(`${realObject[key]} -> ${defaultObject[key]}`)
  //     realObject[key] = defaultObject[key]
  //     return realObject
  // } else {
  //     console.log("doesn't default to null")
  //     if (typeof defaultObject[key] === "object") {
  //         for (const inner_key of Object.keys(defaultObject[key])) {
  //             return defaultReducer(realObject[key], defaultObject[key], inner_key, `${name}.${inner_key}`)
  //         }
  //     }
  // }
  // console.log("AAAHH")
  // process.exit(-1)
  // if (typeof defaultObject[key] === "object") {
  //     for (const inner_key of Object.keys(defaultObject[key])) {
  //         return defaultReducer(realObject[key], defaultObject[key], inner_key, `${name}.${inner_key}`)
  //     }
  //     // console.log("default is object or null")
  //     // console.log(`DEFAULT OBJECT VALUE: ${defaultObject[key]}`)
  //     // console.log(`REAL OBJECT VALUE: ${realObject[key]}`)
  //     // if (defaultObject[key] === null) {
  //     //     console.log("defaults to null")
  //     //     console.log(realObject === undefined)
  //     //     console.log(realObject[key])
  //     //     if (realObject[key] === undefined) {
  //     //         console.log(`key '${key}' is required`)
  //     //         process.exit(-1)
  //     //     } else {
  //     //         console.log(`${realObject[key]} -> ${defaultObject[key]}`)
  //     //         realObject[key] = defaultObject[key]
  //     //         return realObject
  //     //     }
  //     // } else {

  //     // }
  // } else if (realObject[key] === undefined) {
  //     console.log(`   REAL: ${JSON.stringify(realObject[key])}\nDEFAULT: ${JSON.stringify(defaultObject[key])}`)
  //     if (defaultObject[key] === null) {
  //     }
  //     else {
  //     }
  // } else {
  //     console.log(`   REAL: ${JSON.stringify(realObject[key])}\nDEFAULT: ${JSON.stringify(defaultObject[key])}`)
  //     return realObject[key]
  // }
}

function injectDefaults(gantreeConfigObj) {
  console.log('--DEFAULT INJECTION PLACEHOLDER--')
  for (const key of Object.keys(defaults)) {
    const result = defaultReducer(gantreeConfigObj, defaults, key, 'config')
    console.log(result)
    gantreeConfigObj[key] = result
  }
  console.log(gantreeConfigObj)
  return gantreeConfigObj
}

module.exports = {
  defaults: injectDefaults
}
