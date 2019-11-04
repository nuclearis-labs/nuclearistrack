import React from 'react';
import '../ball-atom.css';

function Loader() {
  return (
    <div className="d-flex justify-content-center mt-5">
      <div class="la-ball-atom la-light la-2x">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
