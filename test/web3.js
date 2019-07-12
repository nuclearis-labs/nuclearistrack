const { expect } = require("chai"),
  fs = require("fs"),
  { createHash } = require("crypto"),
  { find, send } = require("../functions/web3");

describe("functions in ../functions/web3.js", function() {
  it("find() should check if hash exists in Smart Contract", function(done) {
    let fileBuffer = fs.readFileSync("./README.md");
    let hash =
      "0x" +
      createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

    find(hash).then(result => {
      console.log(result);

      expect(result).to.have.own.property("foundBlock");
      done();
    });
  });
  it("send() should create a transaction and send it to Blockchain", function(done) {
    let fileBuffer = fs.readFileSync("./README.md");
    let hash =
      "0x" +
      createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

    send(hash).then(result => {
      expect(result).to.be.a("string");
      done();
    });
  });
});
