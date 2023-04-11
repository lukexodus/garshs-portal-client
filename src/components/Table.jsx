import React, { memo } from "react";

const Table = ({ headersList, itemsList, state, stateHandler, ...props }) => {
  return (
    <div
      className={`relative overflow-x-auto shadow-md sm:rounded-lg ${
        props.className ? props.className : ""
      }`}
    >
      <table className="w-full text-sm text-left text-indigo-100">
        <thead className="text-xs text-white uppercase bg-blue-500">
          <tr>
            {headersList.map((header, i) => (
              <th key={i} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itemsList.map((rowItem, i) => {
            let rowBackground;
            if (i % 2 !== 0) {
              rowBackground = "bg-blue-500";
            } else {
              rowBackground = "bg-blue-400";
            }
            return (
              <tr
                key={i}
                className={`${rowBackground} border-b border-blue-400`}
              >
                {rowItem.map((cell, j) => {
                  if (j === 0) {
                    return (
                      <th
                        key={j}
                        scope="row"
                        className="px-6 py-4 font-medium text-blue-50 whitespace-nowrap"
                      >
                        {cell}
                      </th>
                    );
                  } else {
                    return (
                      <td key={j} className="px-6 py-4">
                        {cell}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Table.defaultProps = {
  headersList: ["Select", "Name", "Email", "Section", "LRN"],
};

export default memo(Table);
