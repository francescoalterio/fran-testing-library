## Getting Started

<!-- copied from Getting Started docs, links updated to point to Jest website -->

### Install Jest using npm

```bash
npm install fran-testing-library
```

Fran testing library does not need any configuration to start.

Let's start by writing a test for a function that adds two numbers. First, create a `sum.js` file:

```javascript
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

Then, create a file named `sum.test.js`. This will contain our actual test:

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Add the following section to your `package.json`:

```json
{
  "scripts": {
    "test": "npx fran"
  }
}
```

You can also run npx fran directly

Finally, run `npm test` or `npx fran` and fran-testing-library will print this message:

```bash
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

**You just successfully wrote your first test using fran-testing-library!**
