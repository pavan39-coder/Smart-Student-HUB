import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

/**
 * Success Message Component
 */
const SuccessMessage = ({ message, onClose }) => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
      <FiCheckCircle />
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-auto text-green-700 hover:text-green-900">
          ✕
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;
