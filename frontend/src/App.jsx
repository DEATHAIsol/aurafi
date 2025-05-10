import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import Leaderboard from './Leaderboard';
import ClaimNFT from './ClaimNFT';
import './App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://aurafi.onrender.com';

function App() {
  const [userData, setUserData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  // Home form submit handler
  const handleHomeSubmit = async (wallet, username, twitter) => {
    setSubmitting(true);
    setUserData(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/submit-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, username, twitter }),
      });
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setUserData(null);
    }
    setSubmitting(false);
  };

  // Sidebar link helper
  const navLink = (to, label) => (
    <Link
      to={to}
      className={`py-2 px-3 rounded transition font-semibold ${
        location.pathname === to
          ? 'bg-green-700/20 text-green-300'
          : 'hover:bg-[#23272f] text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="w-screen h-screen min-h-0 min-w-0 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#20242c] flex flex-col justify-between items-stretch border-r border-[#23272f] pt-8 pb-8 z-20">
        <div className="flex flex-col flex-1 px-6">
          <h1 className="text-2xl font-bold mb-10 text-green-400 tracking-wide">Aura_Fi</h1>
          <nav className="flex flex-col gap-4 text-lg">
            {navLink('/', 'Home')}
            {navLink('/leaderboard', 'Leaderboard')}
            {navLink('/claim-nft', 'Claim your NFT')}
            <a href="https://x.com/Aura__Fi" target="_blank" rel="noopener noreferrer" className="py-2 px-3 rounded hover:bg-[#23272f] text-blue-400 font-semibold">Twitter</a>
          </nav>
        </div>
        <div className="px-6 mt-8">
          <button className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold transition">Connect Wallet</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen min-h-0 min-w-0 ml-64 p-0 m-0 relative overflow-auto">
        <div className="absolute inset-0 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
          <Routes>
            <Route path="/" element={<Home onSubmit={handleHomeSubmit} userData={userData} submitting={submitting} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/claim-nft" element={<ClaimNFT userData={userData} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
