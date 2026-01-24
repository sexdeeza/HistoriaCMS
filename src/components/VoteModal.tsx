import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Vote, ExternalLink } from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleVote = () => {
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    if (username.length < 4) {
      setError('Username must be at least 4 characters');
      return;
    }

    // Open gtop100 vote link with username
    window.open(`https://gtop100.com/MapleStory/server-${process.env.REACT_APP_GTOP100_SITE_ID}?vote=1&pingUsername=${encodeURIComponent(username)}`, '_blank');
    setUsername('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  // Use createPortal to render outside of Navbar's DOM hierarchy
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 99998,
        }}
      />

      {/* Modal Container - centered with flexbox */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          className="bg-white dark:bg-royal-darker rounded-2xl border border-pink-100 dark:border-gray-700 p-6 shadow-2xl"
          style={{
            width: '100%',
            maxWidth: '384px',
            pointerEvents: 'auto',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px' }}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-royal-rose to-royal-purple rounded-xl text-white mb-3">
              <Vote className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vote for {process.env.REACT_APP_SERVER_NAME}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Support us and earn rewards!
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="vote-username" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                id="vote-username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter your in-game username"
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-2 ${error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose transition-all`}
              />
              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </div>

            <button
              onClick={handleVote}
              className="w-full py-3 bg-gradient-to-r from-royal-rose to-royal-purple text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Vote Now
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            You can vote every 12 hours
          </p>
        </div>
      </div>
    </>,
    document.body
  );
};

export default VoteModal;
