import ipfs from 'ipfs-http-client';

const node = new ipfs('localhost', '5001', {
  protocol: 'http'
});

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
