import React, { useEffect, useState } from 'react';
import { projectService } from '../services/authService';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FiSearch, FiPlus } from 'react-icons/fi';

/**
 * Projects Page
 */
const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedTab = params.get('tab');
    if (selectedTab === 'my' || selectedTab === 'all') {
      setTab(selectedTab);
    } else {
      setTab('all');
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          projectService.getAllProjects(search),
          projectService.getMyProjects(),
        ]);
        setProjects(allRes.data.data);
        setMyProjects(myRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        setMyProjects(myProjects.filter((p) => p._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const displayProjects = tab === 'all' ? projects : myProjects;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Projects</h1>
        {user?.role === 'student' && (
          <Link
            to="/project/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiPlus /> Add Project
          </Link>
        )}
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-300">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 font-semibold ${tab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          All Projects
        </button>
        <button
          onClick={() => setTab('my')}
          className={`px-4 py-2 font-semibold ${tab === 'my' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          My Projects
        </button>
      </div>

      {/* Search */}
      {tab === 'all' && (
        <div className="mb-8 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProjects.length > 0 ? (
          displayProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={tab === 'my' ? handleDelete : null}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">
              {tab === 'all' ? 'No projects found' : 'You haven\'t created any projects yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
