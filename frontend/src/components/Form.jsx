import React from 'react';

export const Input = ({ label, id, error, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} {...props} />
      {error && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</span>}
    </div>
  );
};

export const Select = ({ label, id, error, children, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <select id={id} {...props}>
        {children}
      </select>
      {error && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</span>}
    </div>
  );
};

export const Textarea = ({ label, id, error, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <textarea id={id} {...props} />
      {error && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</span>}
    </div>
  );
};
