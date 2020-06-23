require('dotenv').config();
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';

export function pinFileToIPFS(
  stream,
  hash
): Promise<{ data: { IpfsHash: string } }> {
  return new Promise((resolve, reject) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append('file', stream, {
      filename: `${hash}.pdf`,
      filepath: `${hash}.pdf`,
      contentType: 'application/pdf'
    });

    axios
      .post(url, data, {
        maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
        headers: {
          // @ts-ignore: Property '_boundary' does not exist on type 'FormData'.
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
        }
      })
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
}
