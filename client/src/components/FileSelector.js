import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const style = {
  margin: '20px 0',
  border: '1px dashed black',
  padding: '15px',
  lineHeight: '40px',
  backgroundColor: 'aliceblue'
};

function FileSelector({ onFileChange, message }) {
  const onDrop = useCallback(
    acceptedFiles => {
      onFileChange(acceptedFiles);
    },
    [onFileChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={style} {...getRootProps()}>
      <input {...getInputProps()} />

      {message ? (
        <p>{message}</p>
      ) : isDragActive ? (
        <p>Drop the files here</p>
      ) : (
        <p>Drop or select file</p>
      )}
    </div>
  );
}

export default FileSelector;
