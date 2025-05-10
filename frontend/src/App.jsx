import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import Leaderboard from './Leaderboard';
import ClaimNFT from './ClaimNFT';
import './App.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://aurafi.onrender.com';

function App() {
  const [userData, setUserData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const { publicKey } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

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
  const navLink = (to, label, onClick) => (
    <Link
      to={to}
      onClick={onClick}
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
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#20242c] flex-col justify-between items-stretch border-r border-[#23272f] pt-8 pb-8 z-20">
        <div className="flex flex-col flex-1 px-6">
          <h1 className="text-2xl font-bold mb-10 text-green-400 tracking-wide">Aura_Fi</h1>
          <nav className="flex flex-col gap-4 text-lg">
            {navLink('/', 'Home')}
            {navLink('/leaderboard', 'Leaderboard')}
            {navLink('/claim-nft', 'Claim your NFT')}
            <a href="https://x.com/Aura__Fi" target="_blank" rel="noopener noreferrer" className="py-2 px-3 rounded hover:bg-[#23272f] text-blue-400 font-semibold">Twitter</a>
            <div className="mt-2">
              <WalletMultiButton className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold transition" />
            </div>
          </nav>
        </div>
      </aside>
      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-[#20242c] flex items-center justify-between px-4 py-3 border-b border-[#23272f] z-30">
        <h1 className="text-xl font-bold text-green-400 tracking-wide">Aura_Fi</h1>
        <button
          className="text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-[#23272f] rounded-lg shadow-lg flex flex-col gap-2 py-4 px-6 w-56 animate-fade-in z-40">
            {navLink('/', 'Home', () => setMenuOpen(false))}
            {navLink('/leaderboard', 'Leaderboard', () => setMenuOpen(false))}
            {navLink('/claim-nft', 'Claim your NFT', () => setMenuOpen(false))}
            <a href="https://x.com/Aura__Fi" target="_blank" rel="noopener noreferrer" className="py-2 px-3 rounded hover:bg-[#23272f] text-blue-400 font-semibold" onClick={() => setMenuOpen(false)}>Twitter</a>
            <div className="mt-2">
              <WalletMultiButton className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold transition" />
            </div>
          </div>
        )}
      </header>
      {/* Main Content */}
      <main className="flex-1 h-screen min-h-0 min-w-0 md:ml-64 p-0 m-0 relative overflow-auto pt-16 md:pt-0">
        <div className="absolute inset-0 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
          <Routes>
            <Route path="/" element={<Home onSubmit={handleHomeSubmit} userData={userData} submitting={submitting} connectedWallet={publicKey?.toBase58() || ''} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/claim-nft" element={<ClaimNFT userData={userData} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
