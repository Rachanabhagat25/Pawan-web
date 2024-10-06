// Spinner.js
import React from 'react';
import './Spinner.css';

const Spinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
