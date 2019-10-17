import React from 'react';
import Dropzone from '../components/Dropzone';

function AddDocumentForm() {
  return (
    <div className="container">
      <h1>Add Document</h1>
      <form>
        <Dropzone />
      </form>
    </div>
  );
}

export default AddDocumentForm;
