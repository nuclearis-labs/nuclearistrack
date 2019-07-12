const { createHash } = require("crypto");

class DocumentClass {
  constructor(file) {
    this.file = file;
  }
  hash() {
    this.hash =
      "0x" +
      createHash("sha256")
        .update(this.file.buffer)
        .digest("hex");
    return this;
  }

  get getFile() {
    return this.file;
  }

  get getHash() {
    return this.hash;
  }
}

module.exports = DocumentClass;
