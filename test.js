const { toBytes, fromBytes } = require("./index");
const fixtures = require("./fixtures");

it("toBytes", () => {
  for (const { from, to } of fixtures) {
    expect(toBytes(from).toString()).toBe(new Uint8Array(to).toString());
  }
});

it("fromBytes", () => {
  for (const { from, to } of fixtures) {
    expect(fromBytes(new Uint8Array(to))).toBe(from);
  }
});

it("fromBytes(toBytes())", () => {
  for (const { from } of fixtures) {
    expect(fromBytes(toBytes(from))).toBe(from);
  }
});
