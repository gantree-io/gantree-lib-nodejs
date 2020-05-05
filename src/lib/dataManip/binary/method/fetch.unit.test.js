const fetch = require('./fetch')
const { throwGantreeError } = require('../../../error')
jest.mock('../../../error')

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods
  throwGantreeError.mockClear()
})

test('returns expected keys', () => {
  expect(
    fetch.resolveFetch({
      url:
        'https://github.com/paritytech/polkadot/releases/download/v0.7.22/polkadot',
      sha256: '1526168270c33b9fd2d650887e85599a6b111c6fde9d90cc10c9f1077bb415ff'
    })
  ).toMatchObject({
    substrate_binary_url:
      'https://github.com/paritytech/polkadot/releases/download/v0.7.22/polkadot',
    substrate_binary_sha256:
      '1526168270c33b9fd2d650887e85599a6b111c6fde9d90cc10c9f1077bb415ff'
  })
})

test('throw error if url missing', () => {
  fetch.resolveFetch({})
  expect(throwGantreeError).toHaveBeenCalledWith(
    'INTERNAL_ERROR',
    Error(
      'fetch method requires a url, this should have been detected during config validation. Please open a Github issue if you see this.'
    )
  )
})

test('missing optionals are defaulted, no errors are thrown', () => {
  const testUrl = 'https://example.com/download-me'
  expect(
    fetch.resolveFetch({
      url: testUrl
    })
  ).toMatchObject({
    substrate_binary_url: testUrl,
    substrate_binary_sha256: 'false'
  })

  // assert that no errors were thrown
  expect(throwGantreeError).toHaveBeenCalledTimes(0)
})

test('handle invalid url', () => {
  // TODO(Denver): create test + implementation
})

test('handle incorrect hash length', () => {
  // TODO(Denver): create test + implementation
})
