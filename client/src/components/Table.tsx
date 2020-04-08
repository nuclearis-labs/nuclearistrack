import React from 'react';

function Table({ body, columns }) {
  return (
    <table className="table mt-5">
      <thead className="thead-dark">
        <tr>
          {columns.map(keys => {
            return <th key={keys}>{keys}</th>;
          })}
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}

export default Table;
