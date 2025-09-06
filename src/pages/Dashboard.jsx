import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProjects, saveProjects } from '../utils/storage';
import { initializeData } from '../utils/storage';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    initializeData();
    setProjects(getProjects());
  }, []);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    const project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      createdAt: new Date().toISOString(),
      createdBy: user.email
    };

    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    setNewProject({ name: '', description: '' });
    setShowCreateModal(false);
  };

  const getProjectColor = (index) => {
    const colors = [
      'from-primary-500 to-primary-600',
      'from-secondary-500 to-secondary-600',
      'from-accent-500 to-accent-600',
      'from-warning-500 to-warning-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-cyan-500 to-cyan-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/20 backdrop-blur-md shadow-lg border-b border-white/30 sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-4">SynergySphere</h1>
              <p className="text-white/90 text-2xl mb-6">Welcome back, {user?.name}!</p>
              <Link
                to="/profile"
                className="inline-block bg-white/20 hover:bg-white/30 px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30 text-white text-xl font-bold"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Your Projects</h2>
          <p className="text-white/90 text-2xl mb-10">Manage and collaborate on your projects</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-white/30 to-white/40 hover:from-white/40 hover:to-white/50 text-white px-12 py-6 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm border border-white/30"
          >
            Create New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="group bg-white/20 backdrop-blur-md hover:bg-white/30 p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/30 hover:border-white/50 animate-fade-in transform hover:-translate-y-2"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`h-4 w-full bg-gradient-to-r ${getProjectColor(index)} rounded-full mb-8 shadow-lg`}></div>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-200 mb-4">
                    {project.name}
                  </h3>
                  <p className="text-white/80 text-xl leading-relaxed">{project.description}</p>
                </div>
                <div className="text-center">
                  <div className="text-white/70 mb-3 text-lg">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80 font-bold text-lg">Active Project</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-24 animate-fade-in">
            <h3 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">No projects yet</h3>
            <p className="text-white/80 text-2xl mb-12 max-w-2xl mx-auto">Get started by creating your first project and begin collaborating with your team</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-white/30 to-white/40 hover:from-white/40 hover:to-white/50 text-white px-16 py-8 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm border border-white/30"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Project</h3>
                <p className="text-gray-600">Start a new project and invite your team</p>
              </div>
              
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Describe your project..."
                    rows="3"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
