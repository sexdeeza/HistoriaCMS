import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ChevronRight, Sparkles } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [dialogStep, setDialogStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const dialogMessages = [
    `Welcome to #${process.env.REACT_APP_SERVER_NAME}#, adventurer! I'm Maple Admin, and I'll help you create your account.`,
    "To begin your journey, you'll need to fill out the form below. Make sure to use a *valid email* - you might need it later!",
    "Your *username* must be at least 4 characters, and your *password* at least 6 characters. Choose wisely!",
    "Once you're registered, head to the *Download* page to get the game client. See you in Maple World!"
  ];

  // Typewriter effect
  useEffect(() => {
    const currentMessage = dialogMessages[dialogStep];
    if (displayedText.length < currentMessage.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
      }, 20);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedText, dialogStep]);

  // Reset text when dialog step changes
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
  }, [dialogStep]);

  const nextDialog = () => {
    if (isTyping) {
      // Skip to full text
      setDisplayedText(dialogMessages[dialogStep]);
      setIsTyping(false);
    } else if (dialogStep < dialogMessages.length - 1) {
      setDialogStep(dialogStep + 1);
    }
  };

  // Format text with highlights
  const formatText = (text: string) => {
    return text.split(/(\*[^*]+\*|#[^#]+#)/g).map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <span key={index} className="text-royal-rose font-semibold">{part.slice(1, -1)}</span>;
      }
      if (part.startsWith('#') && part.endsWith('#')) {
        return <span key={index} className="text-royal-purple font-bold">{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
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
      const response = await fetch('/api/game/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.error || 'Registration failed' });
        return;
      }

      setSuccessMessage('Account created successfully! Redirecting to download...');
      setTimeout(() => {
        navigate('/download');
      }, 2000);

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
      <div className="absolute bottom-[35%] left-[5%] w-6 h-6 border-2 border-pink-300/40 dark:border-pink-500/30 rounded-full floating-orb" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute bottom-[25%] right-[12%] w-5 h-5 bg-purple-400/30 dark:bg-purple-500/20 rounded-lg rotate-45 floating-orb" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-[60%] left-[12%] w-3 h-3 bg-pink-300/50 dark:bg-pink-500/30 rounded-full floating-orb" style={{ animationDelay: '-5s' }}></div>
      <div className="absolute top-[15%] right-[20%] w-12 h-12 border-2 border-purple-200/30 dark:border-purple-500/20 rounded-xl rotate-12 floating-orb" style={{ animationDelay: '-4s' }}></div>
      <div className="absolute bottom-[45%] right-[8%] w-4 h-4 bg-pink-300/40 dark:bg-pink-400/30 rounded-full floating-orb" style={{ animationDelay: '-1s' }}></div>
      <div className="absolute top-[75%] left-[18%] w-8 h-8 border-2 border-pink-200/40 dark:border-pink-500/25 rotate-45 floating-orb" style={{ animationDelay: '-3s' }}></div>

      {/* More Decorative Shapes */}
      <div className="absolute top-[10%] left-[40%] w-5 h-5 bg-pink-300/35 dark:bg-pink-500/25 rounded-full floating-orb" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-[25%] left-[25%] w-7 h-7 border-2 border-purple-300/35 dark:border-purple-500/25 rounded-lg rotate-[30deg] floating-orb" style={{ animationDelay: '-5s' }}></div>
      <div className="absolute top-[8%] right-[35%] w-4 h-4 bg-purple-300/40 dark:bg-purple-500/30 rotate-45 floating-orb" style={{ animationDelay: '-1s' }}></div>
      <div className="absolute top-[35%] right-[25%] w-6 h-6 border-2 border-pink-300/30 dark:border-pink-500/20 rounded-full floating-orb" style={{ animationDelay: '-4s' }}></div>
      <div className="absolute top-[50%] left-[3%] w-9 h-9 border-2 border-purple-200/35 dark:border-purple-500/25 rounded-xl rotate-[20deg] floating-orb" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-[55%] right-[18%] w-3 h-3 bg-pink-400/45 dark:bg-pink-500/35 rounded-full floating-orb" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute top-[68%] right-[3%] w-7 h-7 border-2 border-pink-300/35 dark:border-pink-500/25 rotate-45 floating-orb" style={{ animationDelay: '-5s' }}></div>
      <div className="absolute top-[80%] left-[8%] w-5 h-5 bg-purple-300/35 dark:bg-purple-500/25 rounded-lg floating-orb" style={{ animationDelay: '-1s' }}></div>
      <div className="absolute top-[85%] right-[25%] w-4 h-4 border-2 border-purple-300/40 dark:border-purple-500/30 rounded-full floating-orb" style={{ animationDelay: '-4s' }}></div>
      <div className="absolute top-[22%] left-[5%] w-6 h-6 bg-pink-300/30 dark:bg-pink-500/20 rounded-full floating-orb" style={{ animationDelay: '-3s' }}></div>

      {/* Bottom fade to footer */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-royal-darker to-transparent"></div>

      <div className="w-full max-w-lg relative z-10">
        {/* NPC Dialog Box */}
        <div className="mb-6">
          <div className="flex flex-col items-center gap-2">
            {/* NPC Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-t from-royal-rose/30 to-transparent rounded-full blur-xl"></div>
                <img
                  src="/assets/npc/1.png"
                  alt="Maple Admin"
                  className="relative w-[158px] h-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Dialog Bubble */}
            <div className="relative min-w-[450px]">
              {/* Speech bubble tail - now pointing up */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 bg-white dark:bg-royal-darker rotate-45 border-l border-t border-amber-200 dark:border-amber-900/50"></div>

              <div
                onClick={nextDialog}
                className="relative bg-white dark:bg-royal-darker border-2 border-amber-200 dark:border-amber-900/50 rounded-xl p-5 shadow-xl cursor-pointer hover:border-amber-300 dark:hover:border-amber-800 transition-colors"
              >
                {/* NPC Name Tag */}
                <div className="absolute -top-4 left-4 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full">
                  <span className="text-sm font-bold text-white drop-shadow">Maple Admin</span>
                </div>

                {/* Dialog Text */}
                <div className="mt-3 h-[85px] overflow-hidden">
                  <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed">
                    {formatText(displayedText)}
                    {isTyping && <span className="inline-block w-1 h-4 ml-0.5 bg-royal-rose animate-pulse"></span>}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-amber-100 dark:border-gray-700">
                  <div className="flex gap-1">
                    {dialogMessages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === dialogStep
                            ? 'bg-royal-rose'
                            : index < dialogStep
                              ? 'bg-royal-rose/40'
                              : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  {dialogStep < dialogMessages.length - 1 ? (
                    <span className="flex items-center gap-1 text-xs text-royal-rose font-medium">
                      {isTyping ? 'Click to skip' : 'Next'}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-xs text-green-500 font-medium">Ready to register!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card with gradient border effect */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-royal-rose via-royal-purple to-royal-blue rounded-2xl blur opacity-30"></div>
          <div className="relative bg-white/90 dark:bg-royal-darker/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50 dark:border-gray-700/50">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-full mb-3">
                <Sparkles className="w-4 h-4 text-royal-rose" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Adventurer</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
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
                    placeholder="Choose a username"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-royal-rose transition-colors" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-2 ${errors.email ? 'border-red-400' : 'border-transparent'} rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose focus:bg-white dark:focus:bg-gray-800 transition-all`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password fields in a grid */}
              <div className="grid grid-cols-2 gap-3">
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
                      className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-2 ${errors.password ? 'border-red-400' : 'border-transparent'} rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose focus:bg-white dark:focus:bg-gray-800 transition-all`}
                      placeholder="Password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    Confirm
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-royal-rose transition-colors" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-2 ${errors.confirmPassword ? 'border-red-400' : 'border-transparent'} rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose focus:bg-white dark:focus:bg-gray-800 transition-all`}
                      placeholder="Confirm"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 text-royal-rose border-gray-300 rounded focus:ring-royal-pink"
                />
                <label htmlFor="acceptTerms" className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  I agree to the{' '}
                  <button type="button" className="text-royal-rose hover:underline">Terms</button>
                  {' '}and{' '}
                  <button type="button" className="text-royal-rose hover:underline">Privacy Policy</button>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-xs">{errors.acceptTerms}</p>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm text-center">{errors.submit}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl">
                  <p className="text-green-600 dark:text-green-400 text-sm text-center">{successMessage}</p>
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
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-royal-rose font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
