import React from 'react';

function Loader() {
  return (
    <div className="d-flex justify-content-center mt-5">
      <div
        className="spinner-border"
        role="status"
        style={{ width: '3rem', height: '3rem' }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;
