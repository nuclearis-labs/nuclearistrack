import React, { useState, useContext, useEffect } from 'react';
import FileSelector from '../components/FileSelector';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import ConfirmTx from '../components/ConfirmTx';
import Loader from '../components/Loader';

function AddDocumentForm() {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [processes, setProcesses] = useState({});

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleFileInput(file) {
    setForm(form => ({ ...form, file: file[0] }));
  }

  useEffect(() => {
    if (contextUser && contextUser.hasOwnProperty('address')) {
      axios
        .get(`/api/process/get`)
        .then(({ data }) => {
          setProcesses(data);
          axios.get('/api/project/getDocNumber').then(({ data }) => {
            setForm(form => ({ ...form, docNumber: data }));
            setLoading(false);
          });
        })
        .catch(e => console.log(e));
      navigator.geolocation.getCurrentPosition(({ coords }) =>
        setForm(form => ({
          ...form,
          latitude: coords.latitude,
          longitude: coords.longitude
        }))
      );
    }
  }, [contextUser]);

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData();

    formData.append('file', form.file);
    formData.append('docNumber', form.docNumber);
    formData.append('latitude', form.latitude);
    formData.append('longitude', form.longitude);
    formData.append('email', contextUser.userEmail);
    formData.append('passphrase', form.passphrase);
    axios
      .post(`/api/doc/upload/${form.contract}`, formData, {
        'Content-Type': 'multipart/form-data'
      })
      .then(result => console.log(result));
  }

  return (
    <div className="container">
      <h1>Add Document {}</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <form>
          <div className="form-group">
            <label htmlFor="name">Doc Number</label>
            <input
              className="form-control"
              onChange={handleInput}
              type="text"
              value={Number(form.docNumber) + 1}
              name="documentTitle"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="process">Process</label>
            <select
              className="form-control"
              onChange={handleInput}
              name="contract"
              id="process"
            >
              <option>Choose one...</option>
              {processes.length > 0 &&
                processes.map(process => (
                  <option
                    key={process.contractAddress}
                    value={process.contractAddress}
                  >
                    {process.processName +
                      ' / ' +
                      process.supplierName +
                      ' / ' +
                      process.contractAddress}
                  </option>
                ))}
            </select>
          </div>
          <FileSelector
            onFileChange={handleFileInput}
            message={
              form.file
                ? `${form.file.name} / ${(form.file.size / 1000000).toFixed(
                    3
                  )} MB`
                : ''
            }
          />
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <br />

            <iframe
              width="600"
              height="450"
              style={{ border: '0' }}
              src={
                'https://www.google.com/maps/embed/v1/place?key=AIzaSyCHpdtM1Pvk-nSgdFB02zUeq7TnTy_eGPs&q=' +
                form.latitude +
                ',' +
                form.longitude
              }
              allowFullScreen
            ></iframe>

            {/* <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1642.9764464576415!2d-58.516771441730704!3d-34.55474808609114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb7223f9c416b%3A0x5c89a9b029816ca6!2sGral.%20Balcarce%20160%2C%20B1603BLD%20Villa%20Martelli%2C%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1572442094803!5m2!1ses!2sar"
            width="600"
            height="450"
            frameBorder="0"
            allowFullScreen=""
          ></iframe> */}
          </div>
          <hr />
          <ConfirmTx
            contextUser={contextUser}
            type="Document"
            handleSubmit={handleSubmit}
            handleInput={handleInput}
          />
        </form>
      )}
    </div>
  );
}

export default AddDocumentForm;
