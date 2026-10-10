import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

/**
 * Error Message Component
 */
const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
      <FiAlertCircle />
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-auto text-red-700 hover:text-red-900">
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
