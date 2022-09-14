import { sum } from "../functions/math.js";

test("5 + 10 = 15", () => {
  expect(sum(5, 10)).toBe(15);
});
