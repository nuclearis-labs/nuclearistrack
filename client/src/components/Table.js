import React from 'react';
import { chunk } from '../utils/array.js';
import { Link } from 'react-router-dom';

// import './table.css';

function Table({ data = [], columns, options, additionalFields = [] }) {
  const chunkedArray = chunk(data, 100);
  return (
    <table className="table mt-5">
      <thead className="thead-dark">
        <tr>
          {columns.map(keys => {
            return <th key={keys}>{keys}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {chunkedArray.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center">
              No hay informacion
            </td>
          </tr>
        ) : (
          chunkedArray[options.currentPage - 1].map((proyectos, i) => {
            return (
              <tr key={i}>
                {Object.values(proyectos).map((values, j) => {
                  return <td key={j}>{values}</td>;
                })}
                {additionalFields.map((values, j) => {
                  return (
                    <td>
                      <Link to={`/${values}/` + proyectos[4]}>{values}</Link>
                    </td>
                  );
                })}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default Table;
