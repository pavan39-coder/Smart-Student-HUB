import React from 'react';
import { formatDate, truncateText } from '../utils/helpers';
import { Link } from 'react-router-dom';

/**
 * Project Card Component
 */
const ProjectCard = ({ project, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{truncateText(project.description, 150)}</p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Tech Stack:</p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-4">{formatDate(project.createdAt)}</p>

        <div className="flex gap-2">
          <Link
            to={`/project/${project._id}`}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            View Details
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(project._id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
