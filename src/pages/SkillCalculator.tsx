import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Zap, ChevronDown, Info } from 'lucide-react';

const SkillCalculator: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState('');
  const [changes, setChanges] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const jobCategories = [
    {
      name: 'Explorer - Warrior',
      jobs: [
        { id: 112, name: 'Hero' },
        { id: 122, name: 'Paladin' },
        { id: 132, name: 'Dark Knight' },
      ]
    },
    {
      name: 'Explorer - Magician',
      jobs: [
        { id: 212, name: 'F/P Archmage' },
        { id: 222, name: 'I/L Archmage' },
        { id: 232, name: 'Bishop' },
      ]
    },
    {
      name: 'Explorer - Bowman',
      jobs: [
        { id: 312, name: 'Bowmaster' },
        { id: 322, name: 'Marksman' },
        { id: 332, name: 'Pathfinder' },
      ]
    },
    {
      name: 'Explorer - Thief',
      jobs: [
        { id: 412, name: 'Night Lord' },
        { id: 422, name: 'Shadower' },
        { id: 434, name: 'Blade Master' },
      ]
    },
    {
      name: 'Explorer - Pirate',
      jobs: [
        { id: 512, name: 'Buccaneer' },
        { id: 522, name: 'Corsair' },
        { id: 532, name: 'Cannoneer' },
      ]
    },
    {
      name: 'Cygnus Knights',
      jobs: [
        { id: 1112, name: 'Dawn Warrior' },
        { id: 1212, name: 'Blaze Wizard' },
        { id: 1312, name: 'Wind Archer' },
        { id: 1412, name: 'Night Walker' },
        { id: 1512, name: 'Thunder Breaker' },
      ]
    },
    {
      name: 'Heroes',
      jobs: [
        { id: 2112, name: 'Aran' },
        { id: 2217, name: 'Evan' },
        { id: 2312, name: 'Mercedes' },
        { id: 2412, name: 'Phantom' },
        { id: 2512, name: 'Shade' },
        { id: 2712, name: 'Luminous' },
      ]
    },
    {
      name: 'Resistance',
      jobs: [
        { id: 3112, name: 'Demon Slayer' },
        { id: 3122, name: 'Demon Avenger' },
        { id: 3212, name: 'Battle Mage' },
        { id: 3312, name: 'Wild Hunter' },
        { id: 3512, name: 'Mechanic' },
        { id: 3612, name: 'Xenon' },
        { id: 3712, name: 'Blaster' },
      ]
    },
    {
      name: 'Sengoku',
      jobs: [
        { id: 4112, name: 'Hayato' },
        { id: 4212, name: 'Kanna' },
      ]
    },
    {
      name: 'Nova',
      jobs: [
        { id: 6112, name: 'Kaiser' },
        { id: 6512, name: 'Angelic Buster' },
        { id: 6412, name: 'Cadena' },
        { id: 6312, name: 'Kain' },
      ]
    },
    {
      name: 'Flora',
      jobs: [
        { id: 15212, name: 'Illium' },
        { id: 15512, name: 'Ark' },
        { id: 15112, name: 'Adele' },
      ]
    },
    {
      name: 'Anima',
      jobs: [
        { id: 16412, name: 'Ho Young' },
        { id: 16212, name: 'Lara' },
      ]
    },
    {
      name: 'Other',
      jobs: [
        { id: 5112, name: 'Mihile' },
        { id: 10112, name: 'Zero' },
        { id: 11212, name: 'Beast Tamer' },
        { id: 14212, name: 'Kinesis' },
      ]
    },
  ];

  const fetchSkillChanges = async (jobId: string) => {
    if (!jobId) return;

    setIsLoading(true);
    setError('');
    setChanges(null);

    try {
      const response = await fetch(`/api/game/skillchange?jobid=${jobId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch skill changes');
      }

      const data = await response.json();
      setChanges(data.changes || '');

    } catch (err) {
      setError('Failed to load skill changes. The server may not support this feature.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobSelect = (jobId: number, jobName: string) => {
    setSelectedJob(`${jobId}:${jobName}`);
    setIsDropdownOpen(false);
    fetchSkillChanges(jobId.toString());
  };

  const selectedJobName = selectedJob ? selectedJob.split(':')[1] : '';

  // Format the changes text into readable lines
  const formatChanges = (text: string) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim() !== '');
  };

  return (
    <div className="min-h-[calc(100vh-130px)] px-4 py-8 animated-bg relative overflow-hidden">
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-royal-rose transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header Card */}
        <div className="relative mb-8 z-30">
          <div className="absolute -inset-1 bg-gradient-to-r from-royal-rose via-royal-purple to-royal-blue rounded-2xl blur opacity-30"></div>
          <div className="relative bg-white/90 dark:bg-royal-darker/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50 dark:border-gray-700/50">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-full mb-3">
                <Zap className="w-4 h-4 text-royal-rose" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Skill Changes</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Changes</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                View custom skill modifications for each job class on this server
              </p>
            </div>

            {/* Job Selector */}
            <div className="relative max-w-md mx-auto">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Select Job
              </label>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent rounded-xl text-sm text-left text-gray-900 dark:text-white focus:outline-none focus:border-royal-rose transition-all flex items-center justify-between"
              >
                <span className={selectedJobName ? '' : 'text-gray-400'}>
                  {selectedJobName || 'Choose a job class...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-royal-darker border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                  {jobCategories.map((category) => (
                    <div key={category.name}>
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sticky top-0">
                        {category.name}
                      </div>
                      {category.jobs.map((job) => (
                        <button
                          key={job.id}
                          onClick={() => handleJobSelect(job.id, job.name)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          {job.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-royal-rose animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-center">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && changes !== null && (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-royal-rose via-royal-purple to-royal-blue rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white/90 dark:bg-royal-darker/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50 dark:border-gray-700/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-royal-rose" />
                {selectedJobName} - Custom Changes
              </h2>

              {changes && changes.trim() !== '' ? (
                <div className="space-y-3">
                  {formatChanges(changes).map((line, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm text-gray-700 dark:text-gray-300"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    No custom skill changes for {selectedJobName}. This job uses default GMS skill values.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillCalculator;
