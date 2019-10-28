import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

function Navbar() {
  const { contextUser, logoutUser } = useContext(UserContext);
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (contextUser && contextUser.hasOwnProperty('address')) {
      axios
        .post('/api/user/getBalance/' + contextUser.address)
        .then(({ data }) => {
          setData(data);
          setLoading(false);
        });
    }
  }, [contextUser]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
      <Link className="navbar-brand" to="/">
        NUCLEARIS PoE
      </Link>
      <button className="navbar-toggler" type="button">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse"
        style={{ justifyContent: 'spaceBetween' }}
        id="navbarSupportedContent"
      >
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
          {contextUser && contextUser.userName ? (
            <li className="nav-item">
              <span className="nav-link" onClick={logoutUser}>
                Logout
              </span>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          )}
        </ul>
        {contextUser && contextUser.hasOwnProperty('address') && (
          <div className="nav-item" style={{ alignContent: 'flexEnd' }}>
            <span style={{ marginRight: '50px' }}>
              Balance: {data && data.slice(0, 7)} RBTC
            </span>
            <span>{contextUser.userName}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
