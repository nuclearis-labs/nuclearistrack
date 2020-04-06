import { Transform } from 'stream';

export class AppendInitVect extends Transform {
  initVect: Buffer;
  appended: Boolean;

  constructor(initVect: Buffer, opts?: Object) {
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
