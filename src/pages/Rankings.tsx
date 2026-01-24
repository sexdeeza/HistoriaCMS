import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Crown, Medal, Award, Search, Loader2 } from 'lucide-react';

interface Player {
  rank: number;
  name: string;
  level: number;
  job: string;
  guild: string;
  exp: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const Rankings: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRankings = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/rankings?page=${page}&limit=10&search=${encodeURIComponent(search)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch rankings');
      }

      const data = await response.json();
      setPlayers(data.rankings);
      setPagination(data.pagination);
    } catch (err) {
      setError('Unable to load rankings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankings(pagination.page, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, fetchRankings]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchRankings(1, searchQuery);
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg shadow-yellow-500/30">
            <Crown className="w-5 h-5 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl shadow-lg shadow-gray-400/30">
            <Medal className="w-5 h-5 text-white" />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg shadow-amber-600/30">
            <Award className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">#{rank}</span>
          </div>
        );
    }
  };

  const getRowStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10 dark:to-transparent';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-700/20 dark:to-transparent';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/10 dark:to-transparent';
      default:
        return 'hover:bg-pink-50/50 dark:hover:bg-gray-800/50';
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const { page, totalPages } = pagination;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center py-12 px-4 animated-bg relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl floating-orb"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl floating-orb" style={{ animationDelay: '-3s' }}></div>
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

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Rankings Table */}
        <div className="bg-white/70 dark:bg-royal-darker/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden shadow-xl shadow-pink-500/5">
          {/* Table Header with Search */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800/80 dark:to-gray-800/80 border-b border-pink-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-royal-rose" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Rankings</h1>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-royal-rose transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player..."
                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-royal-rose transition-colors w-48"
              />
            </div>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-pink-100 dark:border-gray-800">
            <div className="col-span-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Rank</div>
            <div className="col-span-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Character</div>
            <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Level</div>
            <div className="col-span-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Job</div>
            <div className="col-span-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Guild</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-pink-50 dark:divide-gray-800 min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-royal-rose animate-spin" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
              </div>
            ) : players.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-500 dark:text-gray-400">No players found</p>
              </div>
            ) : (
              players.map((player) => (
                <div
                  key={player.rank}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors ${getRowStyle(player.rank)}`}
                >
                  <div className="col-span-1">
                    {getRankDisplay(player.rank)}
                  </div>
                  <div className="col-span-3">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {player.name}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-royal-rose/10 to-royal-purple/10 text-royal-rose">
                      Lv. {player.level}
                    </span>
                  </div>
                  <div className="col-span-3 text-gray-600 dark:text-gray-400 text-sm">
                    {player.job}
                  </div>
                  <div className="col-span-3 text-gray-600 dark:text-gray-400 text-sm">
                    {player.guild}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && pagination.total > 0 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-pink-100 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium text-gray-900 dark:text-white">
                  {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of <span className="font-medium text-gray-900 dark:text-white">{pagination.total}</span> players
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-pink-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                {getPageNumbers().map((pageNum, index) => (
                  typeof pageNum === 'number' ? (
                    <button
                      key={index}
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        pagination.page === pageNum
                          ? 'bg-gradient-to-r from-royal-rose to-royal-purple text-white shadow-lg shadow-pink-500/25'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-gray-700 border border-pink-200 dark:border-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ) : (
                    <span key={index} className="text-gray-400 px-1">...</span>
                  )
                ))}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-pink-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rankings;
