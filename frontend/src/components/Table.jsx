import React from 'react';

const Table = ({ headers, data, renderRow, onSort, sortConfig }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                onClick={() => header.sortable && onSort && onSort(header.key)}
                style={{ cursor: header.sortable ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {header.label}
                  {header.sortable && sortConfig && sortConfig.key === header.key && (
                    <span style={{ fontSize: '0.7rem' }}>
                      {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
