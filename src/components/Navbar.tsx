import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Crown, Users, Vote, Clock, LogIn, User, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import VoteModal from './VoteModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState({ online: false, players: 0, startTime: '' });
  const [uptime, setUptime] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const storedUsername = localStorage.getItem('username');
      setIsLoggedIn(!!token && !!storedUsername);
      setUsername(storedUsername || '');
    };

    checkAuth();
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]); // Re-check on route change

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  // Calculate uptime from startTime
  const calculateUptime = (startTimeStr: string) => {
    if (!startTimeStr) return '';
    try {
      const startTime = new Date(startTimeStr);
      const now = new Date();
      const diffMs = now.getTime() - startTime.getTime();

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch {
      return '';
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch server status on mount and every 5 minutes
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        setServerStatus(data);
        if (data.startTime) {
          setUptime(calculateUptime(data.startTime));
        }
      } catch (error) {
        setServerStatus({ online: false, players: 0, startTime: '' });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5 * 60 * 1000); // 5 minutes

    // Update uptime every minute
    const uptimeInterval = setInterval(() => {
      if (serverStatus.startTime) {
        setUptime(calculateUptime(serverStatus.startTime));
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(uptimeInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/download', label: 'Download' },
    { path: '/rankings', label: 'Rankings' },
    { path: '/skills', label: 'Skills' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b border-pink-100 dark:border-gray-800 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 dark:bg-royal-darker/95 shadow-lg shadow-pink-500/5'
        : 'bg-white/80 dark:bg-royal-darker/90'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
          {/* Left - Logo */}
          <Link to="/" className="flex items-center gap-1.5 logo-hover group">
            <Crown className="w-6 h-6 text-royal-rose logo-icon transition-transform duration-300" />
            <span className="text-lg font-bold bg-gradient-to-r from-royal-rose to-royal-purple bg-clip-text text-transparent group-hover:animate-shimmer">
              {process.env.REACT_APP_SERVER_NAME}
            </span>
          </Link>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800/80 dark:to-gray-800/80 rounded-full px-2 py-1.5 border border-pink-100 dark:border-gray-700">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-royal-rose to-royal-purple text-white shadow-lg shadow-pink-500/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-royal-rose hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setIsVoteModalOpen(true)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-royal-rose hover:bg-white/50 dark:hover:bg-gray-700/50 flex items-center gap-1"
              >
                <Vote className="w-3.5 h-3.5" />
                Vote
              </button>
              {isLoggedIn ? (
                <Link
                  to="/account"
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-royal-rose hover:bg-white/50 dark:hover:bg-gray-700/50 flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  {username}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 bg-gradient-to-r from-royal-rose to-royal-purple text-white flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login/Reg
                </Link>
              )}
            </div>
          </div>

          {/* Right - Server Status & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Server Status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${serverStatus.online ? 'from-green-50 to-emerald-50 border-green-100' : 'from-red-50 to-red-50 border-red-100'} dark:from-gray-800 dark:to-gray-800 rounded-full border dark:border-gray-700`}>
              <span className="relative flex h-2 w-2">
                {serverStatus.online ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                )}
              </span>
              <span className={`text-xs font-medium ${serverStatus.online ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {serverStatus.online ? 'Online' : 'Offline'}
              </span>
              {serverStatus.online && uptime && (
                <>
                  <div className="w-px h-3 bg-green-200 dark:bg-gray-600"></div>
                  <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{uptime}</span>
                </>
              )}
              <div className={`w-px h-3 ${serverStatus.online ? 'bg-green-200' : 'bg-red-200'} dark:bg-gray-600`}></div>
              <Users className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{serverStatus.players.toLocaleString()}</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile - Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Server Status (compact) */}
            <div className={`flex items-center gap-1.5 px-2 py-1 ${serverStatus.online ? 'bg-green-50' : 'bg-red-50'} dark:bg-gray-800 rounded-full`}>
              <span className={`w-1.5 h-1.5 ${serverStatus.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'} rounded-full`}></span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {serverStatus.players >= 1000 ? `${(serverStatus.players / 1000).toFixed(1)}k` : serverStatus.players}
              </span>
            </div>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-pink-100 dark:border-gray-800">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-royal-rose to-royal-purple text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsVoteModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 flex items-center gap-2 text-left"
              >
                <Vote className="w-4 h-4" />
                Vote
              </button>
              <div className="border-t border-pink-100 dark:border-gray-800 my-2"></div>
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    My Account ({username})
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-left w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-gradient-to-r from-royal-rose to-royal-purple text-white flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login/Reg
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Vote Modal */}
      <VoteModal isOpen={isVoteModalOpen} onClose={() => setIsVoteModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
