import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, Key, Loader2, Settings, Crown, ChevronRight } from 'lucide-react';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const token = localStorage.getItem('authToken');

    if (!storedUsername || !token) {
      navigate('/login');
      return;
    }

    setUsername(storedUsername);
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');

    try {
      await fetch('/api/game/logout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Ignore errors, we'll logout locally anyway
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setLogoutMessage('Logged out successfully!');

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const accountLinks = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Reset PIC',
      description: 'Reset your Personal Identification Code',
      href: '/reset-pic',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Key className="w-5 h-5" />,
      title: 'Change Password',
      description: 'Update your account password',
      href: '/reset-password',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-130px)] animated-bg relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl floating-orb"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl floating-orb" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-300/15 dark:bg-blue-500/10 rounded-full blur-3xl floating-orb" style={{ animationDelay: '-5s' }}></div>

      {/* Decorative Shapes */}
      <div className="absolute top-20 left-[15%] w-8 h-8 border-2 border-pink-300/40 dark:border-pink-500/30 rounded-lg rotate-12 floating-orb"></div>
      <div className="absolute top-40 right-[10%] w-6 h-6 bg-purple-300/30 dark:bg-purple-500/20 rounded-full floating-orb" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-[30%] left-[8%] w-4 h-4 bg-pink-400/40 dark:bg-pink-500/30 rotate-45 floating-orb" style={{ animationDelay: '-4s' }}></div>

      {/* Bottom fade to footer */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-royal-darker to-transparent"></div>

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {/* Profile Header Card */}
        <div className="relative mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-royal-rose via-royal-purple to-royal-blue rounded-3xl blur opacity-40"></div>
          <div className="relative bg-white/95 dark:bg-royal-darker/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-gray-700/50">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-royal-rose via-royal-purple to-royal-blue relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>

            {/* Avatar & Info */}
            <div className="px-6 pb-6 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-royal-rose to-royal-purple rounded-2xl flex items-center justify-center shadow-xl border-4 border-white dark:border-royal-darker">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center border-2 border-white dark:border-royal-darker">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 sm:pb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{username}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    {process.env.REACT_APP_SERVER_NAME} Adventurer
                  </p>
                </div>

                {/* Logout Button - Desktop */}
                <div className="hidden sm:block">
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Message */}
        {logoutMessage && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-2xl mb-6">
            <p className="text-green-600 dark:text-green-400 text-sm text-center font-medium">{logoutMessage}</p>
          </div>
        )}

        {/* Settings Section */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-royal-rose via-royal-purple to-royal-blue rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white/90 dark:bg-royal-darker/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50 dark:border-gray-700/50">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-royal-rose" />
              Account Settings
            </h2>

            <div className="space-y-3">
              {accountLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{link.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{link.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-royal-rose group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="sm:hidden w-full mt-6 py-4 bg-white/90 dark:bg-royal-darker/90 backdrop-blur-xl text-gray-600 dark:text-gray-400 font-semibold rounded-2xl border border-white/50 dark:border-gray-700/50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Account;
