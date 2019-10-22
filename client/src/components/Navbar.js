import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
      <Link className="navbar-brand" to="/">
        NUCLEARIS PoE
      </Link>
      <button className="navbar-toggler" type="button">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/project-list">
              Project List <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/add-project">
              Add Project <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/user-list">
              User List <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/add-document">
              Add Document
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/verify-document">
              Verify Document
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/add-user">
              Add User
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/transfer">
              Transfer
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;
