import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Loader2, Shield, Sparkles, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPIC: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username || formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/game/reset-pic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.error || 'Failed to reset PIC' });
        return;
      }

      setSuccess(true);

    } catch (error) {
      setErrors({ submit: 'Unable to connect to server. Please try again later.' });
    } finally {
      setIsLoading(false);
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

            {!success ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-full mb-3">
                    <Shield className="w-4 h-4 text-royal-rose" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset PIC</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Enter your account credentials to reset your PIC
                  </p>
                </div>

                {/* Info Box */}
                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl mb-6">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    <p className="font-medium mb-1">What is PIC?</p>
                    <p>PIC (Personal Identification Code) is a secondary password used when selecting characters. This will reset it so you can set a new one in-game.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Username
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-royal-rose transition-colors" />
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-2 ${errors.username ? 'border-red-400' : 'border-transparent'} rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose focus:bg-white dark:focus:bg-gray-800 transition-all`}
                        placeholder="Enter your username"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-royal-rose transition-colors" />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-2 ${errors.password ? 'border-red-400' : 'border-transparent'} rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose focus:bg-white dark:focus:bg-gray-800 transition-all`}
                        placeholder="Enter your password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Error Message */}
                  {errors.submit && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl">
                      <p className="text-red-600 dark:text-red-400 text-sm text-center">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mt-2 bg-gradient-to-r from-royal-rose to-royal-purple text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Reset PIC
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">PIC Reset!</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Your PIC has been reset successfully. You can now set a new PIC when you log into the game.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-royal-rose to-royal-purple text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all"
                >
                  Return to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPIC;
