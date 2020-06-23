import React, { FunctionComponent } from 'react';

type ITable = {
  columns: string[];
  children: JSX.Element;
};

const Table: FunctionComponent<ITable> = ({ children, columns }) => {
  return (
    <table className="table mt-5">
      <thead className="thead-dark">
        <tr>
          {columns.map((keys: string) => {
            return <th key={keys}>{keys}</th>;
          })}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
