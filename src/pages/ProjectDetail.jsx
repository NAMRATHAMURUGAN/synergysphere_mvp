import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProjects, getTasks, saveTasks, getComments, saveComments } from '../utils/storage';
import TaskModal from '../components/TaskModal';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const projects = getProjects();
    const foundProject = projects.find(p => p.id === parseInt(id));
    setProject(foundProject);
    setTasks(getTasks(parseInt(id)));
    setComments(getComments(parseInt(id)));
  }, [id]);

  const handleTaskUpdate = (taskId, updates) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    saveTasks(parseInt(id), updatedTasks);
  };

  const handleTaskCreate = (newTask) => {
    const task = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(parseInt(id), updatedTasks);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      text: newComment,
      author: user.email,
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    saveComments(parseInt(id), updatedComments);
    setNewComment('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'status-done';
      case 'In Progress': return 'status-progress';
      default: return 'status-todo';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return '✓';
      case 'In Progress': return '⚡';
      default: return '○';
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center animate-fade-in">
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-danger-100 to-warning-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-16 h-16 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Project not found</h2>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="btn-primary">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-3 bg-white/60 hover:bg-white/80 px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="h-10 w-10 rounded-full border-2 border-white shadow-md"
                />
                <div className="hidden sm:block">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">View Profile</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Project Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.name}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{project.description}</p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{tasks.length} tasks</span>
            <span>•</span>
            <span>{comments.length} discussions</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8">
          <nav className="flex space-x-1 p-1">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'tasks'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Tasks ({tasks.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('discussions')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'discussions'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Discussions ({comments.length})</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'tasks' && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Tasks</h2>
                <p className="text-gray-600">Manage and track your project tasks</p>
              </div>
              <button
                onClick={() => setShowTaskModal(true)}
                className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2 shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Task</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {tasks.map((task, index) => (
                <div key={task.id} className="card-hover p-6 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex-1">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getStatusIcon(task.status)}</span>
                      <select
                        value={task.status}
                        onChange={(e) => handleTaskUpdate(task.id, { status: e.target.value })}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(task.status)} focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200`}
                      >
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {tasks.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="mx-auto w-32 h-32 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Create your first task to start organizing your project work</p>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="btn-primary shadow-xl"
                >
                  Create Your First Task
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'discussions' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Discussions</h2>
              <p className="text-gray-600">Collaborate and discuss with your team</p>
            </div>
            
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="card p-6">
                <div className="flex space-x-4">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="h-12 w-12 rounded-full border-2 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add a comment
                      </label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts with the team..."
                        className="input-field resize-none"
                        rows="4"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Post Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments */}
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div key={comment.id} className="card p-6 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex space-x-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${comment.author.split('@')[0]}&background=6366f1&color=fff`}
                      alt={comment.author}
                      className="h-12 w-12 rounded-full border-2 border-white shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="font-bold text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                        <div className="flex-1"></div>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-16 animate-fade-in">
                  <div className="mx-auto w-32 h-32 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No discussions yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Start the conversation by adding the first comment to this project</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSave={handleTaskCreate}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
