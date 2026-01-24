import React from 'react';
import { Download, Monitor, HardDrive, Cpu, MemoryStick, RefreshCw, Settings, Shield, Gamepad2 } from 'lucide-react';

const DownloadPage: React.FC = () => {
  const systemRequirements = [
    { icon: <Monitor className="w-5 h-5" />, label: 'Operating System', min: 'Windows 7', rec: 'Windows 10/11' },
    { icon: <Cpu className="w-5 h-5" />, label: 'Processor', min: 'Intel Core i3', rec: 'Intel Core i5+' },
    { icon: <MemoryStick className="w-5 h-5" />, label: 'Memory', min: '4 GB RAM', rec: '8 GB RAM' },
    { icon: <HardDrive className="w-5 h-5" />, label: 'Storage', min: '20 GB HDD', rec: '20 GB SSD' },
  ];

  const features = [
    { icon: <RefreshCw className="w-5 h-5" />, title: 'Auto-Updater', desc: 'Always stay up to date' },
    { icon: <Settings className="w-5 h-5" />, title: 'Pre-Configured', desc: 'Ready to play instantly' },
    { icon: <Shield className="w-5 h-5" />, title: 'Anti-Cheat', desc: 'Fair gameplay for all' },
    { icon: <Gamepad2 className="w-5 h-5" />, title: 'Controller Support', desc: 'Play your way' },
  ];

  const steps = [
    { num: '01', title: 'Download', desc: 'Click the download button to get the installer' },
    { num: '02', title: 'Install', desc: 'Run the installer and follow the instructions' },
    { num: '03', title: 'Play', desc: `Launch ${process.env.REACT_APP_SERVER_NAME} and start your adventure!` },
  ];

  return (
    <div className="animated-bg relative overflow-hidden min-h-[calc(100vh-130px)]">
      {/* Floating orbs */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl floating-orb"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl floating-orb" style={{ animationDelay: '-3s' }}></div>
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
      <div className="absolute top-[42%] left-[22%] w-4 h-4 border-2 border-pink-200/45 dark:border-pink-500/35 rotate-12 floating-orb" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-[65%] left-[30%] w-5 h-5 bg-purple-400/30 dark:bg-purple-500/20 rounded-full floating-orb" style={{ animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[15%] left-[35%] w-8 h-8 border-2 border-purple-300/30 dark:border-purple-500/20 rounded-xl rotate-[25deg] floating-orb" style={{ animationDelay: '-1s' }}></div>
      <div className="absolute bottom-[20%] right-[35%] w-3 h-3 bg-pink-300/45 dark:bg-pink-500/35 rotate-45 floating-orb" style={{ animationDelay: '-4s' }}></div>
      <div className="absolute top-[38%] right-[40%] w-6 h-6 border-2 border-pink-300/35 dark:border-pink-500/25 rounded-full floating-orb" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute bottom-[30%] left-[45%] w-4 h-4 bg-purple-300/40 dark:bg-purple-500/30 rounded-lg rotate-12 floating-orb" style={{ animationDelay: '-2s' }}></div>

      {/* Bottom fade to footer */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-royal-darker to-transparent"></div>

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Download Card */}
        <section className="mb-12">
          <div className="bg-white/70 dark:bg-royal-darker/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 p-8 shadow-xl shadow-pink-500/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-royal-rose to-royal-purple rounded-xl shadow-lg shadow-pink-500/30">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{process.env.REACT_APP_SERVER_NAME} Client</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Version 232 • 21 GB • Windows</p>
                </div>
              </div>
              <a
                href={process.env.REACT_APP_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-rose to-royal-purple text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transition-all"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Download Now
              </a>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            What's Included
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
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
        </section>

        {/* How to Install */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            How to Install
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-royal-rose/50 to-royal-purple/50"></div>
                )}
                <div className="bg-white/70 dark:bg-royal-darker/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 p-6 text-center hover:shadow-xl hover:shadow-pink-500/10 transition-all group relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-royal-rose to-royal-purple rounded-full text-white text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-royal-rose transition-colors">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* System Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            System Requirements
          </h2>

          <div className="bg-white/70 dark:bg-royal-darker/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden shadow-xl shadow-pink-500/5">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800/80 dark:to-gray-800/80 border-b border-pink-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Component</div>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 text-center uppercase tracking-wide">Minimum</div>
              <div className="text-xs font-bold text-royal-rose text-center uppercase tracking-wide">Recommended</div>
            </div>

            {/* Rows */}
            {systemRequirements.map((req, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 px-6 py-4 items-center hover:bg-pink-50/50 dark:hover:bg-gray-800/30 transition-colors ${
                  index !== systemRequirements.length - 1 ? 'border-b border-pink-100/50 dark:border-gray-700/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-lg text-royal-rose">
                    {req.icon}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{req.label}</span>
                </div>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">{req.min}</div>
                <div className="text-center text-sm font-medium text-gray-900 dark:text-white">{req.rec}</div>
              </div>
            ))}
          </div>

          {/* Help Note */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              Having trouble installing?
            </p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 border border-pink-200 dark:border-gray-700 rounded-xl text-royal-rose font-medium hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors">
              Join our Discord
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DownloadPage;
