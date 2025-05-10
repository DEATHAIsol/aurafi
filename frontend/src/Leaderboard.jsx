import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/leaderboard');
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        setLeaderboard([]);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in">
      <div className="w-full max-w-5xl bg-[#23272f] rounded-2xl shadow-2xl p-14 border border-[#2e323c]">
        <h2 className="text-5xl font-extrabold mb-10 text-center text-green-300 tracking-wide flex items-center justify-center gap-4">
          <span role="img" aria-label="trophy" className="text-yellow-400 text-6xl">🏆</span>
          Leaderboard
        </h2>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8 text-2xl">Loading...</div>
          ) : (
            <table className="min-w-full text-left text-xl">
              <thead>
                <tr className="text-green-400 border-b-2 border-[#2e323c] text-2xl">
                  <th className="py-4 px-6">#</th>
                  <th className="py-4 px-6">Username</th>
                  <th className="py-4 px-6">Aura Points</th>
                  <th className="py-4 px-6">Win Rate</th>
                  <th className="py-4 px-6">Avg Return</th>
                  <th className="py-4 px-6">Twitter</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-gray-400 py-8 text-2xl">No data yet</td></tr>
                ) : (
                  leaderboard.map((user, i) => (
                    <tr
                      key={user.wallet + i}
                      className={
                        `border-b border-[#2e323c] ${
                          i === 0 ? 'bg-yellow-900/20' :
                          i === 1 ? 'bg-gray-700/20' :
                          i === 2 ? 'bg-orange-900/20' :
                          i % 2 === 0 ? 'bg-[#181c24]/60' : ''
                        } hover:bg-[#181c24]`
                      }
                    >
                      <td className="py-4 px-6 font-bold text-2xl">
                        {i === 0 ? <span role="img" aria-label="crown" className="text-yellow-400">👑</span> : i + 1}
                      </td>
                      <td className="py-4 px-6 font-semibold">{user.username || 'anon'}</td>
                      <td className="py-4 px-6 text-green-300 font-bold">{user.auraPoints}</td>
                      <td className="py-4 px-6">{user.winRate}</td>
                      <td className="py-4 px-6">{user.avgReturn}</td>
                      <td className="py-4 px-6 text-blue-400">{user.twitter ? `@${user.twitter}` : ''}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 