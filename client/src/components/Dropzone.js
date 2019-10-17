import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function Dropzone() {
  const [isFileRead, setFileRead] = useState(false);
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles = acceptedFiles.map(file => {
      const reader = new FileReader();
      reader.onload = event => {
        let test = Object.assign(file, { bs64: event.target.result });
        setFileRead(true);
        return test;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({ onDrop });

  return (
    <div style={{ marginTop: '50px' }}>
      <div className="form-group">
        <label htmlFor="name">Document Name</label>
        <input className="form-control" id="name" type="text" name="name" />
      </div>

      <div
        {...getRootProps()}
        style={{
          lineHeight: '50px',
          height: '100px',
          border: '3px dashed black',
          backgroundColor: '#FFF',
          color: '#000',
          padding: '20px'
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        {isFileRead &&
          acceptedFiles.length > 0 &&
          acceptedFiles.map((files, i) => {
            return (
              <div style={{ marginTop: '10px' }} key={i}>
                <div>Fecha Ultima Modificación: {Date(files.lastModified)}</div>
                <div>Nombre: {files.name}</div>
                <div>Ruta: {files.path}</div>
                <div>Tamaño: {files.size / 1000000} MB</div>
                <div>Tipo de archivo: {files.type}</div>
                <iframe width="100%" height="500px" src={files.bs64}></iframe>
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default Dropzone;
