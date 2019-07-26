const { expect } = require("chai"),
  fs = require("fs"),
  { createHash } = require("crypto"),
  Blockchain = require("../classes/Blockchain");

describe("Blockchain Class", function() {
  it("findBlock() method should check if hash exists in Smart Contract", function(done) {
    let fileBuffer = fs.readFileSync("./README.md");

    new Blockchain({ buffer: fileBuffer })
      .createHash()
      .findBlock()
      .then(result => {
        expect(result).to.have.property("foundBlock");
        done();
      });
  });
  it("sendTx() should create a transaction and send it to Blockchain", function(done) {
    let fileBuffer = fs.readFileSync("./README.md");
    this.timeout(10000);
    let tx = new Blockchain({ buffer: fileBuffer }).createHash();
    tx.sendTx().finally(result => {
      done();
    });
  });
});
