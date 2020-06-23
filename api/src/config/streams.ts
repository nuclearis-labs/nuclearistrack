import stream from 'stream';
import { createHash, Hash } from 'crypto';

export class HashStream extends stream.Transform {
  hash: string;
  digester: Hash;

  constructor(algo, opts?: Object) {
    super(opts);
    this.digester = createHash(algo);
  }
  _transform(chunk, encoding, cb) {
    this.digester.update(chunk);
    this.push(chunk);
    cb();
  }

  _flush(cb) {
    this.hash = `0x${this.digester.digest('hex')}`;
    cb();
  }
}

export class PDFModStream extends stream.Transform {
  buffer: Buffer[];

  constructor(private fn: Function, private text: string, opts?: Object) {
    super(opts);
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

export class AppendInitVect extends stream.Transform {
  constructor(
    private initVect: Buffer,
    private appended?: boolean,
    opts?: Object
  ) {
    super(opts);
    this.initVect = initVect;
    this.appended = false;
  }

  _transform(chunk, encoding, cb) {
    if (!this.appended) {
      this.push(this.initVect);
      this.appended = true;
    }
    this.push(chunk);
    cb();
  }
}
