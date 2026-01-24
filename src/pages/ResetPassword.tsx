import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Loader2, Key, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resetKey = searchParams.get('key');

  // State for request form
  const [email, setEmail] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // State for reset form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // If we have a reset key in URL, we're in reset mode
  const isResetMode = !!resetKey;

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRequestError('Please enter a valid email address');
      return;
    }

    setIsRequestLoading(true);
    setRequestError('');

    try {
      const response = await fetch('/api/game/reset-password-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRequestError(data.error || 'Failed to send reset email');
        return;
      }

      setRequestSuccess(true);

    } catch (error) {
      setRequestError('Unable to connect to server. Please try again later.');
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    setIsResetLoading(true);
    setResetError('');

    try {
      const response = await fetch('/api/game/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: resetKey,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResetError(data.error || 'Failed to reset password');
        return;
      }

      setResetSuccess(true);

    } catch (error) {
      setResetError('Unable to connect to server. Please try again later.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center px-4 py-8 animated-bg relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl floating-orb"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl floating-orb" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-300/15 dark:bg-blue-500/10 rounded-full blur-3xl floating-orb" style={{ animationDelay: '-5s' }}></div>

      {/* Decorative Shapes */}
      <div className="absolute top-20 left-[15%] w-8 h-8 border-2 border-pink-300/40 dark:border-pink-500/30 rounded-lg rotate-12 floating-orb"></div>
      <div className="absolute top-40 right-[10%] w-6 h-6 bg-purple-300/30 dark:bg-purple-500/20 rounded-full floating-orb" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-[30%] left-[8%] w-4 h-4 bg-pink-400/40 dark:bg-pink-500/30 rotate-45 floating-orb" style={{ animationDelay: '-4s' }}></div>
      <div className="absolute top-[45%] right-[5%] w-10 h-10 border-2 border-purple-300/30 dark:border-purple-500/20 rounded-full floating-orb" style={{ animationDelay: '-1s' }}></div>

      {/* Bottom fade to footer */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-royal-darker to-transparent"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card with gradient border effect */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-royal-rose via-royal-purple to-royal-blue rounded-2xl blur opacity-30"></div>
          <div className="relative bg-white/90 dark:bg-royal-darker/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50 dark:border-gray-700/50">
            {/* Back Link */}
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-royal-rose transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>

            {!isResetMode ? (
              // REQUEST RESET FORM
              !requestSuccess ? (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-full mb-3">
                      <Sparkles className="w-4 h-4 text-royal-rose" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Recovery</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Enter your email to receive a password reset link
                    </p>
                  </div>

                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-royal-rose transition-colors" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setRequestError('');
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-2 ${requestError ? 'border-red-400' : 'border-transparent'} rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose focus:bg-white dark:focus:bg-gray-800 transition-all`}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {requestError && (
                        <p className="text-red-500 text-xs mt-1">{requestError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isRequestLoading}
                      className="w-full py-3 mt-2 bg-gradient-to-r from-royal-rose to-royal-purple text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isRequestLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          Send Reset Link
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Sent!</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    If an account exists with that email, you'll receive a password reset link shortly.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-royal-rose to-royal-purple text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all"
                  >
                    Return to Login
                  </Link>
                </div>
              )
            ) : (
              // RESET PASSWORD FORM (with key)
              !resetSuccess ? (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-full mb-3">
                      <Key className="w-4 h-4 text-royal-rose" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Enter your new password below
                    </p>
                  </div>

                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="newPassword" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        New Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-royal-rose transition-colors" />
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setResetError('');
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-2 ${resetError ? 'border-red-400' : 'border-transparent'} rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose focus:bg-white dark:focus:bg-gray-800 transition-all`}
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-royal-rose transition-colors" />
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setResetError('');
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-2 ${resetError ? 'border-red-400' : 'border-transparent'} rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose focus:bg-white dark:focus:bg-gray-800 transition-all`}
                          placeholder="Confirm new password"
                        />
                      </div>
                      {resetError && (
                        <p className="text-red-500 text-xs mt-1">{resetError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isResetLoading}
                      className="w-full py-3 mt-2 bg-gradient-to-r from-royal-rose to-royal-purple text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isResetLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        <>
                          <Key className="w-5 h-5" />
                          Reset Password
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Your password has been successfully reset. You can now login with your new password.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-royal-rose to-royal-purple text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all"
                  >
                    Go to Login
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
