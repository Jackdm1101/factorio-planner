const rewire = require('rewire');
const index = rewire('../src/index.js');

test('returns true', () => {
    expect(index.__get__("getTrue")()).toBe(true);
});