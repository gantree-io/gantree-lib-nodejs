// function warnHeadDefault() { console.warn('No version specified, using repository HEAD') }

// function resolveRepository() {
//     if (binKeys.repository !== undefined) {
//         binKeys.repository.version = opt.default(binKeys.repository.version, 'HEAD', warnHeadDefault)
//         return binKeys.repository
//     }
// }

// /**
//  * @param {object} binaryObject - value of the binary key in Gantree configuration
//  * @returns {object} ansible inventory binary keys
//  */
// function resolveBinMethod(binKeys) {
//     resolverLookup = {
//         "repository": resolveRepository,
//         "fetch": resolveFetch,
//         "local": resolveLocal,
//         "preset": resolvePreset
//     }
//     // for (const { k, v } of Object.entries(resolverLookup)):
//     //     if (binKeys.hasOwnProperty(k)) {
//     //         v()
//     //     }
//     return binKeys
// }

// module.exports = {
//     resolveBinMethod
// }
