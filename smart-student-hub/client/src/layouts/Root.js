import React from 'react';
import { useAuth } from '../context/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Root component to handle initial page load
 */
const Root = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return children;
};

export default Root;
