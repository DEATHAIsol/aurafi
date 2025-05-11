import { useEffect, useState, useRef } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://aurafi.onrender.com';

export default function LeaderboardTicker() {
  const [users, setUsers] = useState([]);
  const tickerRef = useRef(null);

  // Fetch leaderboard data
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/leaderboard`);
        const data = await res.json();
        // Show the 10 most recent (or top 10 if no timestamps)
        setUsers(data.slice(0, 10));
      } catch (err) {
        setUsers([]);
      }
    }
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  // Duplicate users for seamless looping
  const tickerUsers = [...users, ...users];

  return (
    <div className="hidden md:flex fixed top-0 left-0 w-screen overflow-hidden bg-[#181c24] border-b border-green-700 z-30" style={{height: '2.5rem'}}>
      <div
        ref={tickerRef}
        className="flex items-center animate-ticker whitespace-nowrap w-max"
        style={{animationDuration: `${tickerUsers.length * 3}s`}}
      >
        {tickerUsers.map((user, i) => (
          <div key={user.wallet + i} className="flex items-center gap-3 px-6 text-green-200 text-sm md:text-base font-semibold">
            <span className="text-green-400">#{i % users.length + 1}</span>
            <span className="font-bold">{user.username || 'anon'}</span>
            <span className="text-green-300">{user.auraPoints}</span>
            <span className="text-xs text-gray-400">Aura</span>
          </div>
        ))}
      </div>
    </div>
  );
} 