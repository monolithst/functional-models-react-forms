import { assert } from 'chai'
import { titleCase, isOk } from '../../src/utils'

describe('/src/utils.ts', () => {
  describe('#titleCase()', () => {
    it('should produce TestMe from "test me"', () => {
      const actual = titleCase('test me')
      const expected = "TestMe"
      assert.equal(actual, expected)
    })
  })
  describe('#isOk()', () => {
    it('should return true if there is an empty object', () => {
      const actual = isOk({})
      assert.isTrue(actual)
    })
  })
})

