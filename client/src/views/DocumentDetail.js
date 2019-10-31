import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileSelector from '../components/FileSelector';
import Hash from '../components/Hash';
import Loader from '../components/Loader';

function DocumentDetail({ match }) {
  const [doc, setDoc] = useState({});
  const [result, setResult] = useState(false);
  const [isLoading, setLoading] = useState(true);

  function handleFileInput(file) {
    let formData = new FormData();
    formData.append('file', file[0]);
    axios
      .post(`/api/doc/verify/${match.params.contract}`, formData, {
        'Content-Type': 'multipart/form-data'
      })
      .then(result =>
        setResult({
          state: 'success',
          message: 'The file you provided is authentic',
          data: result
        })
      )
      .catch(e =>
        setResult({ state: 'error', message: 'The file does not correspond' })
      );
  }

  useEffect(() => {
    axios
      .get(`/api/doc/download/${match.params.contract}/${match.params.hash}`)
      .then(({ data }) => {
        setDoc(data);
        setLoading(false);
      });
  }, []);

  let mineTime = new Date(Number(doc.mineTime * 1000));
  let date = `${mineTime.getDate()}/${mineTime.getMonth()}/${mineTime.getFullYear()} ${mineTime.getHours()}:${mineTime.getMinutes()}`;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'right'
          }}
        >
          <iframe
            src={`data:application/pdf;base64,${doc.buffer}`}
            width="60%"
            title="documentView"
            height="700"
          ></iframe>
          <div style={{ marginLeft: '50px' }}>
            <h1>Document Detail</h1>
            <div>
              <b>DocNumber:</b> {doc.docNumber}
            </div>

            <div>
              <b>Hash:</b> <Hash hash={doc.hash} />
            </div>
            <div>
              <b>Mine Time:</b> {date}
            </div>
            <div>
              <b>StorageHash:</b> <Hash hash={doc.storageHash} />
            </div>
            <FileSelector
              onFileChange={handleFileInput}
              message={result.message}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentDetail;
