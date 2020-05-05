const { throwGantreeError } = require('./error')
const error_meta = require('../static_data/error_meta')
const RED = '\x1b[31m'
const STYLE_RESET = '\x1b[0m'

// used to test for missing values in error meta
const fakeErrorMeta = {
  errors: {
    ERROR_WITH_MISSING_MESSAGE: {
      code: 11111
    },
    ERROR_WITH_MISSING_CODE: {
      message: 'this error is missing an error code'
    }
  }
}

test('throwGantreeError was exported', () => {
  expect(throwGantreeError).toBeDefined()
})

test('error meta is version 1.0', () => {
  expect(error_meta.metadata.version).toBe('1.0')
})

test('exit codes + output match error_meta entries', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
  const mockConsoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {})

  // keep track of exit codes used, no duplicates allowed
  let exitCodesUsed = []

  for (const [errName, errAttribs] of Object.entries(error_meta.errors)) {
    const testError = Error('generic message')
    throwGantreeError(errName, testError)
    expect(mockExit).toHaveBeenCalledWith(errAttribs.code)
    expect(mockConsoleLog).toHaveBeenCalledWith(
      `${RED}FAIL:[${errAttribs.code}] ${errAttribs.message}: ${testError.message}${STYLE_RESET}`
    )
    expect(mockConsoleError).toHaveBeenCalledWith(
      `FAIL:[${errAttribs.code}] ${errAttribs.message}: ${testError.message}`
    )

    // check if this exit code has already been used
    expect(exitCodesUsed.includes(errAttribs.code)).toBe(false)
    exitCodesUsed.push(errAttribs.code)
  }
  mockExit.mockRestore()
  mockConsoleLog.mockRestore()
  mockConsoleError.mockRestore()
})

test('complain if no matching error meta', () => {
  const mockConsoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {})

  try {
    throwGantreeError('NOT_A_REAL_ERROR_ALIAS', Error('test error message'))
  } catch (err) {
    // expect error message to be thrown
    expect(err).toEqual(Error('test error message'))
    // expect message about bad error alias
    expect(mockConsoleError).toHaveBeenCalledWith(
      'INTERNAL ERROR: Invalid error alias given! Does not exist in error meta!'
    )
  }

  mockConsoleError.mockRestore()
})

test('handle data missing from error meta or args', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
  const mockConsoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {})

  // use error alias that's missing a message
  try {
    throwGantreeError(
      'ERROR_WITH_MISSING_MESSAGE',
      Error('this has no message in error_meta'),
      { overrideErrorMeta: fakeErrorMeta }
    )
  } catch (err) {
    true
  }

  expect(mockExit).toHaveBeenCalledWith(11111)
  expect(mockConsoleLog).toHaveBeenCalledWith(
    `${RED}FAIL:[11111] no message defined in error meta: this has no message in error_meta${STYLE_RESET}`
  )
  expect(mockConsoleError).toHaveBeenCalledWith(
    'no message meta defined for error!'
  )

  // clear mocks for next test
  mockExit.mockClear()
  mockConsoleLog.mockClear()
  mockConsoleError.mockClear()

  // use error alias that's missing a code
  try {
    throwGantreeError(
      'ERROR_WITH_MISSING_CODE',
      Error('this has no code in error_meta'),
      { overrideErrorMeta: fakeErrorMeta }
    )
  } catch (err) {
    true
  }

  expect(mockExit).toHaveBeenCalledWith(1)
  expect(mockConsoleLog).toHaveBeenCalledWith(
    `${RED}FAIL:[1] this error is missing an error code: this has no code in error_meta${STYLE_RESET}`
  )
  expect(mockConsoleError).toHaveBeenCalledWith(
    'no code meta defined for error!'
  )

  // clear mocks for next test
  mockExit.mockClear()
  mockConsoleLog.mockClear()
  mockConsoleError.mockClear()

  // use function without giving an error
  try {
    throwGantreeError('GENERIC_ERROR')
  } catch (err) {
    true
  }

  expect(mockExit).toHaveBeenCalledWith(1)
  expect(mockConsoleLog).toHaveBeenCalledWith(
    `${RED}FAIL:[1] generic error: no error passed${STYLE_RESET}`
  )
  expect(mockConsoleError).toHaveBeenCalledWith(
    'no error passed to error wrapper!'
  )

  // restore mocks
  mockExit.mockRestore()
  mockConsoleLog.mockRestore()
  mockConsoleError.mockRestore()
})
