import React, { useEffect, useState } from 'react';
import { projectService } from '../services/authService';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate } from '../utils/helpers';
import { FiGithub, FiExternalLink, FiTag } from 'react-icons/fi';

/**
 * Project Detail Page
 */
const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      setError('Invalid project ID format');
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await projectService.getProject(id);
        setProject(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => window.history.back()} className="text-blue-600 hover:underline mb-6">
        ← Back
      </button>

      {/* Project Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-blue-100 mb-4">{project.description}</p>
        <p className="text-sm text-blue-200">By {project.createdBy?.name} • {formatDate(project.createdAt)}</p>
      </div>

      {/* Problem & Solution */}
      {(project.problem || project.solution) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {project.problem && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Problem</h3>
              <p className="text-gray-600">{project.problem}</p>
            </div>
          )}
          {project.solution && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Solution</h3>
              <p className="text-gray-600">{project.solution}</p>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      {project.features && project.features.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Features</h3>
          <ul className="space-y-3">
            {project.features.map((feature, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-gray-800">{feature.title}</p>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Stack */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiTag /> Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Screenshots */}
      {project.screenshots && project.screenshots.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Screenshots</h3>
          <div className="space-y-4">
            {project.screenshots.map((screenshot, index) => (
              <div key={index}>
                <img
                  src={screenshot.url}
                  alt={screenshot.caption}
                  className="w-full rounded-lg max-h-400"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/800x400')}
                />
                {screenshot.caption && <p className="text-gray-600 text-sm mt-2">{screenshot.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow, Challenges, Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {project.workflow && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Workflow</h3>
            <p className="text-gray-600 text-sm">{project.workflow}</p>
          </div>
        )}
        {project.challenges && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Challenges</h3>
            <p className="text-gray-600 text-sm">{project.challenges}</p>
          </div>
        )}
        {project.futureImprovements && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Future Improvements</h3>
            <p className="text-gray-600 text-sm">{project.futureImprovements}</p>
          </div>
        )}
      </div>

      {/* Links */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex gap-4">
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiGithub /> View on GitHub
          </a>
        )}
        {project.liveLink && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiExternalLink /> Visit Live
          </a>
        )}
      </div>

      {/* Creator Info */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">About Creator</h3>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            {project.createdBy?.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-800">{project.createdBy?.name}</p>
            <p className="text-gray-600 text-sm">{project.createdBy?.bio}</p>
            {project.createdBy?.socialLinks?.portfolio && (
              <a
                href={project.createdBy.socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View Portfolio
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
