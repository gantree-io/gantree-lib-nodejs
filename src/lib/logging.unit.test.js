const { returnLogger } = require('./logging')

test('logger in a winston object', () => {
  expect(returnLogger('meta_test')).toBeDefined()
})
