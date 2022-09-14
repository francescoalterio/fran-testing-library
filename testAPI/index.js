function test(message, callback) {
  console.log(`MESSAGE: ${message}`);
  callback();
}

function expect(expectValue) {
  return {
    toBe(toBeValue) {
      if (expectValue === toBeValue) {
        console.log(" + PASS");
      } else {
        console.log(
          ` - ERROR: Expected - ${toBeValue} | Result: ${expectValue}`
        );
      }
    },
  };
}
