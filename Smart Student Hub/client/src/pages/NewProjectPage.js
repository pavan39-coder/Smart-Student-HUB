import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const NewProjectPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problem: '',
    solution: '',
    techStack: '',
    features: '',
    githubLink: '',
    liveLink: '',
    workflow: '',
    challenges: '',
    futureImprovements: '',
    screenshots: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      problem: formData.problem || undefined,
      solution: formData.solution || undefined,
      githubLink: formData.githubLink || undefined,
      liveLink: formData.liveLink || undefined,
      workflow: formData.workflow || undefined,
      challenges: formData.challenges || undefined,
      futureImprovements: formData.futureImprovements || undefined,
    };

    if (formData.techStack.trim()) {
      const techStackArray = formData.techStack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => ({ name }));
      payload.techStack = JSON.stringify(techStackArray);
    }

    if (formData.features.trim()) {
      try {
        const featuresParsed = JSON.parse(formData.features);
        if (Array.isArray(featuresParsed)) {
          payload.features = JSON.stringify(featuresParsed);
        }
      } catch {
        setError('Features must be valid JSON array of objects. e.g. [{"title":"","description":""}]');
        return;
      }
    }

    if (formData.screenshots.trim()) {
      try {
        const screenshotsParsed = JSON.parse(formData.screenshots);
        if (Array.isArray(screenshotsParsed)) {
          payload.screenshots = JSON.stringify(screenshotsParsed);
        }
      } catch {
        setError('Screenshots must be valid JSON array of objects. e.g. [{"url":"","caption":""}]');
        return;
      }
    }

    setLoading(true);
    try {
      await projectService.addProject(payload);
      setSuccess('Project created successfully! Redirecting to your projects...');
      setFormData({
        title: '',
        description: '',
        problem: '',
        solution: '',
        techStack: '',
        features: '',
        githubLink: '',
        liveLink: '',
        workflow: '',
        challenges: '',
        futureImprovements: '',
        screenshots: '',
      });
      // Navigate to Projects page and show user-specific tab
      navigate('/projects?tab=my');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Project</h1>
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Project Title"
            className="border rounded-lg px-4 py-2"
          />
          <input
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            placeholder="GitHub Link (optional)"
            className="border rounded-lg px-4 py-2"
          />
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Project Description"
          rows="4"
          className="w-full border rounded-lg px-4 py-2"
        />

        <textarea
          name="problem"
          value={formData.problem}
          onChange={handleChange}
          placeholder="Problem Statement (optional)"
          rows="3"
          className="w-full border rounded-lg px-4 py-2"
        />

        <textarea
          name="solution"
          value={formData.solution}
          onChange={handleChange}
          placeholder="Solution (optional)"
          rows="3"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          name="liveLink"
          value={formData.liveLink}
          onChange={handleChange}
          placeholder="Live Project Link (optional)"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          name="workflow"
          value={formData.workflow}
          onChange={handleChange}
          placeholder="Workflow Summary (optional)"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          name="techStack"
          value={formData.techStack}
          onChange={handleChange}
          placeholder="Tech Stack (comma-separated, optional)"
          className="w-full border rounded-lg px-4 py-2"
        />

        <textarea
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder='Features (JSON array, optional) e.g. [{"title":"...","description":"..."}]'
          rows="3"
          className="w-full border rounded-lg px-4 py-2"
        />

        <textarea
          name="screenshots"
          value={formData.screenshots}
          onChange={handleChange}
          placeholder='Screenshots (JSON array, optional) e.g. [{"url":"...","caption":"..."}]'
          rows="3"
          className="w-full border rounded-lg px-4 py-2"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? <LoadingSpinner /> : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Go to Projects
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectPage;
