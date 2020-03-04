function getVarName(obj) {
  if (typeof obj != 'object') {
    throw Error(
      'Please wrap your variable in curly braces when giving to function'
    )
  }
  const wrapped_var_name = Object.keys(obj)[0]
  const var_name = Object.keys(obj[wrapped_var_name])[0]
  return var_name
}

function getVarValue(obj) {
  if (typeof obj != 'object') {
    throw Error(
      'Please wrap your variable in curly braces when giving to function'
    )
  }
  const wrapped_var_name = Object.keys(obj)[0]
  const var_name = Object.keys(obj[wrapped_var_name])[0]
  const value = obj[wrapped_var_name][var_name]
  return value
}

function ensureBool(supposed_boolean) {
  const var_value = getVarValue({ supposed_boolean })
  if (typeof var_value === 'boolean') {
    return var_value
  } else {
    const var_name = getVarName({ supposed_boolean })
    throw Error(`variable '${var_name}' must be a boolean`)
  }
}

module.exports = {
  ensureBool
}
