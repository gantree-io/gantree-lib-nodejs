const { throwGantreeError } = require('./error')
const error_meta = require('../static_data/error_meta')
const RED = '\x1b[31m'
const STYLE_RESET = '\x1b[0m'

test('throwGantreeError was exported', () => {
  expect(throwGantreeError).toBeDefined()
})

test('error meta is version 1.0', () => {
  expect(error_meta.metadata.version).toBe('1.0')
})

test('exit codes + output match error_meta entries', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  const mockStdout = jest.spyOn(console, 'log').mockImplementation(() => {})
  const mockStderr = jest.spyOn(console, 'error').mockImplementation(() => {})

  // keep track of exit codes used, no duplicates allowed
  let exitCodesUsed = []

  for (const [errName, errAttribs] of Object.entries(error_meta.errors)) {
    const testError = Error('generic message')
    throwGantreeError(errName, testError)
    expect(mockExit).toHaveBeenCalledWith(errAttribs.code)
    expect(mockStdout).toHaveBeenCalledWith(
      `${RED}FAIL:[${errAttribs.code}] ${errAttribs.message}: ${testError.message}${STYLE_RESET}`
    )
    expect(mockStderr).toHaveBeenCalledWith(
      `FAIL:[${errAttribs.code}] ${errAttribs.message}: ${testError.message}`
    )

    // check if this exit code has already been used
    expect(exitCodesUsed.includes(errAttribs.code)).toBe(false)
    exitCodesUsed.push(errAttribs.code)
  }
  mockExit.mockRestore()
  mockStdout.mockRestore()
  mockStderr.mockRestore()
})
