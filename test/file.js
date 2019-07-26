const { expect } = require("chai"),
  Documento = require("../classes/Documento");

describe("functions in ../functions/file.js", function() {
  it("getExtension getter should obtain the file extension", function() {
    let extension = new Documento({ originalname: "README.MD" }).getExtension;

    expect(extension).to.be.a("string");
    expect(extension).to.have.lengthOf.within(2, 4);
  });
});
