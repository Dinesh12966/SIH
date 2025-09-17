import React, { useState } from 'react';
import { View } from '../App';
import PasswordInput from '../components/PasswordInput';

interface LoginPageProps {
  onLogin: (email: string) => void;
  setView: (view: View) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      onLogin(email.trim());
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-blur">
      <div className="bg-secondary-900/80 backdrop-blur-xl border border-secondary-700 shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500">
              Civic Voice
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Welcome back. Let's make a difference.
            </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-secondary-900 border border-secondary-700 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <PasswordInput 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>
            
            <div className="text-center text-xs text-gray-600">
              This is a simulated login for demonstration.
            </div>

            <div>
              <button
                type="submit"
                disabled={!email.trim() || !password.trim()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-secondary-950 bg-gradient-to-r from-primary-400 to-primary-500 bg-[length:200%_auto] hover:animate-gradient-shift disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-100"
              >
                Sign In
              </button>
            </div>
             <div className="text-center text-sm">
                <button 
                  type="button" 
                  onClick={() => setView('signup')}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Don't have an account? Sign Up
                </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default LoginPage;