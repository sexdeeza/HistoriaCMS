import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Zap, Package, Keyboard, MousePointer, Map, Users, Clock, Sparkles, ChevronRight, X } from 'lucide-react';

const Home: React.FC = () => {
  const [dialogStep, setDialogStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showNpc, setShowNpc] = useState(true);

  const expRate = process.env.REACT_APP_EXP_RATE || '1';
  const mesoRate = process.env.REACT_APP_MESO_RATE || '1';
  const dropRate = process.env.REACT_APP_DROP_RATE || '1';

  const dialogMessages = [
    `Hey there, adventurer! Welcome to #${process.env.REACT_APP_SERVER_NAME}#! I'm your friendly Maple Admin.`,
    `We've got *x${expRate} EXP*, *x${mesoRate} Meso*, and *x${dropRate} Drop* rates - perfect for both casual and hardcore players!`,
    "From *Auto Job Advance* to *Pet Auto-Loot*, we've got everything you need. Ready to start? Hit that *Download* button!"
  ];

  // Typewriter effect
  useEffect(() => {
    if (!showNpc) return;
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
  }, [displayedText, dialogStep, showNpc]);

  // Reset text when dialog step changes
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
  }, [dialogStep]);

  const nextDialog = () => {
    if (isTyping) {
      setDisplayedText(dialogMessages[dialogStep]);
      setIsTyping(false);
    } else if (dialogStep < dialogMessages.length - 1) {
      setDialogStep(dialogStep + 1);
    } else {
      setShowNpc(false);
    }
  };

  const closeNpc = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNpc(false);
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

  const qolFeatures = [
    { icon: <Zap className="w-6 h-6" />, title: 'Auto Job Advance', desc: 'Automatic job advancement' },
    { icon: <Package className="w-6 h-6" />, title: 'Stackable Items', desc: 'Stack up to 30,000 items' },
    { icon: <Keyboard className="w-6 h-6" />, title: 'Quick Slots', desc: 'Extended hotkey system' },
    { icon: <MousePointer className="w-6 h-6" />, title: 'Auto Loot', desc: 'Pet auto-loot included' },
    { icon: <Map className="w-6 h-6" />, title: 'World Map', desc: 'Enhanced navigation' },
    { icon: <Users className="w-6 h-6" />, title: 'Party Search', desc: 'Easy party finding' },
    { icon: <Clock className="w-6 h-6" />, title: '24/7 Uptime', desc: 'Stable server always online' },
    { icon: <Sparkles className="w-6 h-6" />, title: 'Custom Events', desc: 'Weekly events & rewards' },
  ];

  // NPC Dialog Component
  const NpcDialog = () => (
    <div
      onClick={nextDialog}
      className="flex gap-3 items-end cursor-pointer group mt-16"
    >
      {/* NPC Image */}
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-t from-royal-rose/30 to-transparent rounded-full blur-xl"></div>
          <img
            src="/assets/npc/1.png"
            alt="Maple Admin"
            className="relative w-[158px] h-auto drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Dialog Bubble */}
      <div className="relative min-w-[450px]">
        {/* Speech bubble tail */}
        <div className="absolute -left-2 bottom-4 w-4 h-4 bg-white dark:bg-royal-darker rotate-45 border-l border-b border-amber-200 dark:border-amber-900/50"></div>

        <div className="relative bg-white dark:bg-royal-darker border-2 border-amber-200 dark:border-amber-900/50 rounded-xl p-5 shadow-xl group-hover:border-amber-300 dark:group-hover:border-amber-800 transition-colors">
          {/* Close button */}
          <button
            onClick={closeNpc}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-400 hover:text-white transition-colors z-10"
          >
            <X className="w-3 h-3" />
          </button>

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
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-amber-100 dark:border-gray-700">
            <div className="flex gap-1.5">
              {dialogMessages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === dialogStep
                      ? 'bg-royal-rose'
                      : index < dialogStep
                        ? 'bg-royal-rose/40'
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="flex items-center gap-1 text-sm text-royal-rose font-medium">
              {isTyping ? 'Click to skip' : dialogStep < dialogMessages.length - 1 ? 'Next' : 'Got it!'}
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/2.jpg)', backgroundPosition: 'center 55%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#fff5f5] dark:to-[#1a1a2e]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Welcome Card */}
            <div className="max-w-xl">
              <div className="bg-white/80 dark:bg-royal-darker/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 p-8 shadow-xl shadow-pink-500/10">
                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  Welcome to
                  <span className="block animate-shimmer text-5xl sm:text-6xl pb-2">
                    {process.env.REACT_APP_SERVER_NAME}
                  </span>
                </h1>

                <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                  Experience the ultimate MapleStory adventure on {process.env.REACT_APP_SERVER_NAME}.
                  No pay-to-win, active community, and exciting content.
                </p>

                {/* Server Rates */}
                <div className="flex gap-3 mt-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-bold text-royal-rose">x{process.env.REACT_APP_EXP_RATE}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">EXP</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-bold text-royal-rose">x{process.env.REACT_APP_MESO_RATE}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Meso</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-bold text-royal-rose">x{process.env.REACT_APP_DROP_RATE}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Drop</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/download"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-royal-rose to-royal-purple hover:shadow-lg hover:shadow-pink-500/30 text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    <Download className="w-5 h-5" />
                    Download Client
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>

            {/* NPC Dialog - Hero Section */}
            {showNpc && (
              <div className="hidden lg:block lg:flex-1 animate-fade-in">
                <NpcDialog />
              </div>
            )}
          </div>

          {/* Mobile NPC - Hero Section */}
          {showNpc && (
            <div className="lg:hidden mt-6 animate-fade-in">
              <NpcDialog />
            </div>
          )}
        </div>
      </section>

      {/* QoL Features Section */}
      <section className="animated-bg relative overflow-hidden pt-16 pb-24">
        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl floating-orb"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl floating-orb" style={{ animationDelay: '-3s' }}></div>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Quality of Life Features
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {qolFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/70 dark:bg-royal-darker/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 p-5 text-center hover:scale-105 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-royal-rose to-royal-purple rounded-xl text-white mb-3 group-hover:shadow-lg group-hover:shadow-pink-500/30 transition-all">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
