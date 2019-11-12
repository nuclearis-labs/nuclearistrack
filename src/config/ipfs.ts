import ipfs from 'ipfs-http-client';

let host: string;
let port: string;
if (process.env.NODE_ENV === 'development') {
  host = 'localhost';
  port = '5001';
} else {
  host = 'ec2-18-229-161-21.sa-east-1.compute.amazonaws.com';
  port = '5001';
}

const node = new ipfs(host, port, { protocol: 'http' });

export async function saveToIPFS(buffer: Buffer) {
  try {
    const [{ hash }] = await node.add(buffer);
    return hash;
  } catch (err) {
    throw Error(err);
  }
}

export async function getFromIPFS(hash: string) {
  try {
    return await node.get(hash);
  } catch (err) {
    throw Error(err);
  }
}
