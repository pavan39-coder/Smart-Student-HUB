import React, { useEffect, useState } from 'react';
import { portfolioService } from '../services/authService';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ActivityCard from '../components/ActivityCard';
import ProjectCard from '../components/ProjectCard';
import { FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';

/**
 * Public Portfolio Page
 */
const PublicPortfolioPage = () => {
  const { portfolioId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await portfolioService.getPortfolio(portfolioId);
        setPortfolio(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [portfolioId]);

  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true);
      const response = await portfolioService.downloadPortfolioPDF(portfolioId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `${portfolio?.user?.name ? portfolio.user.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'portfolio'}_portfolio.pdf`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download portfolio PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const { user, activities, projects } = portfolio;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
        <p className="text-blue-100 mb-4">{user.bio}</p>
        <div className="flex flex-wrap gap-4 items-center">
          <a href={`mailto:${user.email}`} className="flex items-center gap-2 hover:text-blue-200 transition-colors">
            <FiMail /> Email
          </a>
          {user.socialLinks?.github && (
            <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <FiGithub /> GitHub
            </a>
          )}
          {user.socialLinks?.linkedin && (
            <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <FiLinkedin /> LinkedIn
            </a>
          )}
          <button
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            className="bg-white text-blue-700 hover:bg-blue-100 transition-colors px-4 py-2 rounded-lg font-semibold"
          >
            {pdfLoading ? 'Preparing PDF...' : 'Download Portfolio PDF'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Points</h3>
          <p className="text-3xl font-bold text-blue-600">{user.points}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Activities</h3>
          <p className="text-3xl font-bold text-green-600">{activities.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Projects</h3>
          <p className="text-3xl font-bold text-purple-600">{projects.length}</p>
        </div>
      </div>

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {activities.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      )}

      {activities.length === 0 && projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No activities or projects yet</p>
        </div>
      )}
    </div>
  );
};

export default PublicPortfolioPage;
