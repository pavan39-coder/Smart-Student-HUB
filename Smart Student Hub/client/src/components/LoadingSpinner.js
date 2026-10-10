import React from 'react';
import { FiLoader } from 'react-icons/fi';

/**
 * Loading Spinner Component
 */
const LoadingSpinner = ({ fullPage = false }) => {
  const spinner = (
    <div className="flex justify-center items-center">
      <FiLoader className="animate-spin text-blue-600" size={32} />
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
