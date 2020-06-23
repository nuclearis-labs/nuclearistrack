// Type definitions for ipfs-http-client
// Project: https://github.com/ipfs/js-ipfs-http-client
// Definitions by: Sebastian Martinez <https://github.com/sebastinez>

/// <reference types="node" />

import fs from 'fs';

type Callback<T> = (error: Error, result?: T) => void;

type FileContent = Object | Blob | string;

interface IPFSFile {
  path: string;
  hash: string;
  size: number;
  content?: FileContent;
}
interface IPFSGetResult {
  depth: number;
  name: string;
  path: string;
  size: number;
  hash: Buffer;
  content: Buffer;
  type: 'file' | string;
}

type Multihash = any | string;

declare class IPFS {
  constructor(host: string, port: string, options: object);

  add(data: FileContent, options: any, callback: Callback<IPFSFile[]>): void;
  add(data: FileContent, options: any): Promise<IPFSFile[]>;
  add(data: FileContent, callback: Callback<IPFSFile[]>): void;
  add(data: FileContent): Promise<IPFSFile[]>;

  get(hash: Multihash, callback: Callback<IPFSFile[] | IPFSGetResult[]>): void;
  get(hash: Multihash): Promise<IPFSFile[] | IPFSGetResult[]>;
}

export = IPFS;
