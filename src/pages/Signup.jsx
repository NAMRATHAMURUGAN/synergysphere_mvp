import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = signup(email, password, name);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('Signup failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-bounce-gentle" style={{animationDelay: '6s'}}></div>
      </div>

      <div className="relative z-10 max-w-lg w-full space-y-8 animate-fade-in">
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/30">
          {/* Logo/Header */}
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Join SynergySphere
            </h2>
            <p className="text-white/90 text-2xl">
              Create your account and start collaborating
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-xl font-bold text-white mb-4 text-center">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full px-8 py-6 border-2 border-white/30 rounded-2xl focus:border-white/60 focus:ring-4 focus:ring-white/20 transition-all duration-200 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 text-center text-xl"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xl font-bold text-white mb-4 text-center">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-8 py-6 border-2 border-white/30 rounded-2xl focus:border-white/60 focus:ring-4 focus:ring-white/20 transition-all duration-200 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 text-center text-xl"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xl font-bold text-white mb-4 text-center">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-8 py-6 border-2 border-white/30 rounded-2xl focus:border-white/60 focus:ring-4 focus:ring-white/20 transition-all duration-200 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 text-center text-xl"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-8 py-6 rounded-2xl text-center animate-slide-up backdrop-blur-sm text-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-white/30 to-white/40 hover:from-white/40 hover:to-white/50 text-white px-12 py-8 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/30"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            <div className="text-center">
              <p className="text-white/90 text-xl">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-bold text-yellow-300 hover:text-yellow-200 transition-colors duration-200 underline text-2xl"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
