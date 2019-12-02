import stream from 'stream';
import { createHash, Hash } from 'crypto';

export class HashStream extends stream.Transform {
  hash: string;
  length: number;
  digester: Hash;

  constructor(algo) {
    super();
    this.digester = createHash(algo);
  }
  _transform(chunk, encoding, cb) {
    this.digester.update(chunk);
    this.length += chunk.length;
    this.push(chunk);
    cb();
  }

  _flush(cb) {
    this.hash = `0x${this.digester.digest('hex')}`;
    cb();
  }
}

export class PDFModStream extends stream.Transform {
  fn: Function;
  buffer: Buffer[];
  text: string;

  constructor(fn: Function, text: string) {
    super();
    this.fn = fn;
    this.buffer = [];
    this.text = text;
  }
  _transform(chunk, encoding, cb) {
    this.buffer.push(chunk);
    cb();
  }
  _flush(cb) {
    this.fn(this.buffer, this.text).then(result => {
      this.push(result);
      cb();
    });
  }
}
