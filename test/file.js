const { expect } = require("chai"),
  { getExtension } = require("../functions/file");

describe("functions in ../functions/file.js", function() {
  it("getExtension() should obtain the file extension", async function() {
    let originalname = "README.md";

    let extension = await getExtension({ originalname });

    expect(extension).to.be.a("string");
    expect(extension).to.have.lengthOf.within(2, 4);
  });
});
