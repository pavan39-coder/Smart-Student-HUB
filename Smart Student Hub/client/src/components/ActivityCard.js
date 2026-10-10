import React from 'react';
import { getActivityTypeBadgeColor, getStatusBadgeColor, formatDate } from '../utils/helpers';

const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/api\/?$/, '') : '';

const getFileUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_URL}${path}`;
};

/**
 * Activity Card Component
 */
const ActivityCard = ({ activity, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
          <p className="text-gray-600 text-sm">{formatDate(activity.date)}</p>
        </div>
        <div className="space-y-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getActivityTypeBadgeColor(activity.type)}`}>
            {activity.type}
          </span>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusBadgeColor(activity.status)}`}>
            {activity.status}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{activity.description}</p>

      {activity.points > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-700 font-semibold">Points: {activity.points}</p>
        </div>
      )}

      {activity.certificate && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            📄 Certificate: <a href={getFileUrl(activity.certificate.filePath)} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              {activity.certificate.originalName}
            </a>
          </p>
        </div>
      )}

      {activity.rejectionReason && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <p className="text-red-700 font-semibold">Rejection Reason:</p>
          <p className="text-red-600">{activity.rejectionReason}</p>
        </div>
      )}

      {activity.status === 'pending' && onEdit && onDelete && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(activity)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(activity._id)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
