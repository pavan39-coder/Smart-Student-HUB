/**
 * Utility Functions
 */

/**
 * Format date to readable format
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get activity type badge color
 */
export const getActivityTypeBadgeColor = (type) => {
  const colors = {
    hackathon: 'bg-blue-100 text-blue-800',
    competition: 'bg-red-100 text-red-800',
    workshop: 'bg-green-100 text-green-800',
    certification: 'bg-purple-100 text-purple-800',
    project: 'bg-yellow-100 text-yellow-800',
    internship: 'bg-indigo-100 text-indigo-800',
    publication: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return colors[type] || colors.other;
};

/**
 * Get status badge color
 */
export const getStatusBadgeColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    faculty_approved: 'bg-indigo-100 text-indigo-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
