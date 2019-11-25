require('dotenv').config();
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { Readable } from 'stream';

function BufferToReadStream(buffer: Buffer): Promise<FormData> {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.on('readable', () => {
      resolve(data);
    });
  });
}

export async function saveToPinata(buffer: Buffer): Promise<string> {
  try {
    const data = await BufferToReadStream(buffer);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        withCredentials: true,
        maxContentLength: -1,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
        }
      }
    );
    return response.data.IpfsHash;
  } catch (err) {
    throw Error(err);
  }
}

export async function getFromPinata(hash: string): Promise<AxiosResponse> {
  try {
    return await axios.get('https://gateway.pinata.cloud/ipfs/' + hash, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
      }
    });
  } catch (err) {
    throw Error(err);
  }
}
