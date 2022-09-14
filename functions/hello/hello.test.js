import { sayHello } from "./hello.js";

test("say hello", () => {
  expect(sayHello("hello")).toBe("hello");
});
