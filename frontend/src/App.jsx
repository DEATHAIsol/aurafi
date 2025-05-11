import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import Leaderboard from './Leaderboard';
import ClaimNFT from './ClaimNFT';
import Rewards from './Rewards';
import './App.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://aurafi.onrender.com';

const INFO_CONTENT = {
  privacy: {
    title: '🔐 Privacy Policy',
    content: `Aura Points collects and processes Solana wallet addresses and publicly available on-chain blockchain data in order to generate performance metrics and rankings. This data is used to compute trading activity analytics and assign "Aura Points" to each wallet based on wallet-level activity.\n\nWe do not collect sensitive or personally identifiable information unless explicitly and voluntarily provided by the user, such as a preferred username or Twitter handle. Even when such data is submitted, it is used solely for display and personalization purposes on the leaderboard and associated features.\n\nAll data is stored securely using encrypted database practices, and access is limited to trusted systems and team members. We maintain a strict policy against:\n\n* Selling or distributing user data to third parties\n* Using user data for targeted advertising\n* Monetizing user data in any form\n\nBy interacting with Aura Points, users consent to the public display of their wallet's associated analytics and metrics. The data processed is derived only from what is already publicly accessible on the Solana blockchain.\n\nTransparency, integrity, and respect for user autonomy are foundational values. Users may request removal of voluntarily submitted metadata (like usernames or Twitter links) at any time by contacting support.`
  },
  legal: {
    title: '⚖️ Legal Policy',
    content: `Aura Points is a blockchain analytics platform operating in a purely observational and non-custodial capacity. It is designed for education, entertainment, and community engagement around Solana wallet activity. It does not provide brokerage services, store user funds, or facilitate trading of any financial instruments.\n\nKey legal disclaimers include:\n\n* We do not offer financial, legal, or tax advice\n* Metrics are not investment recommendations or predictions\n* Leaderboard rankings are based purely on algorithmic evaluations of past public blockchain data\n* No user should interpret rankings or Aura Points as indicative of skill, future performance, or endorsement\n* Use of this platform is at the user's own risk, and Aura Points accepts no liability for financial losses\n\nIt is the user's responsibility to comply with all local laws regarding crypto trading, taxation, and financial disclosures. Aura Points may be updated or suspended without notice, and we reserve the right to modify the platform's scoring algorithms or data processing logic to preserve fairness and accuracy.`
  },
  rules: {
    title: '📜 Rules Policy',
    content: `1. Users must only submit wallets they own or have explicit permission to represent.\n2. Submitting wallets with intent to impersonate, spoof, or game the system will result in removal from the leaderboard and potential blacklisting.\n3. Use of bots or automation to flood the platform, simulate trades, or submit mass wallet entries is strictly prohibited.\n4. All leaderboard positions are determined by our proprietary Aura Points algorithm and are non-negotiable.\n5. Leaderboard data is public and meant for transparency. If users wish to delist a wallet, they may contact support with proper verification.\n6. Artificial inflation of trade volume (wash trading) or attempts to loop transactions to farm Aura Points are considered manipulation and will result in disqualification.\n7. Users may not attempt to reverse engineer the scoring algorithm, exploit vulnerabilities, or interfere with backend operations.\n8. Users who attempt to post offensive, misleading, or inappropriate usernames or Twitter handles may be removed without warning.\n9. We reserve the right to modify rules at any time to ensure fair use and data integrity.\n10. Continued use of the site after a rule update constitutes agreement to the latest terms.`
  },
  partners: {
    title: '🤝 Our Partners',
    content: `Aura Points thrives through the collaboration of several leading Web3 infrastructure providers and community stakeholders. These partnerships empower us to offer rich analytics and maintain the integrity of our scoring system:\n\n* Helius – Provides deep indexing infrastructure to track and decode Solana wallet transactions with speed and reliability.\n* Birdeye – Supplies token pricing history and real-time price feeds to support accurate trade valuations and ROI calculations.\n* Jupiter Aggregator – Enables liquidity routing data that helps us understand the context and behavior of memecoin transactions.\n* Cointelegraph – Supports Aura Points through media exposure and trusted crypto journalism.\n* Dexscreener – Offers visualization tools and trade tracking for monitoring token flow and market behavior.\n* Pump.fun – One of the primary platforms for launching and interacting with memecoins, which underpins the majority of our tracked activity.\n* Axiom – An emerging protocol focused on bringing zk-powered compute and verifiable analytics to the Solana ecosystem.\n* Bullx – Assists with growth strategy, smart contract safety monitoring, and infrastructure reliability.\n* Triton RPC – Our performance RPC provider, powering fast and scalable Solana RPC queries.\n\nWe continue to build relationships with strategic investment DAOs, Solana ecosystem builders, and token analytics platforms to increase transparency and the richness of the Aura Points experience. These partnerships are foundational to the quality, speed, and credibility of the analytics Aura Points delivers.`
  }
};

function InfoModal({ open, onClose, section }) {
  if (!open || !section) return null;
  const { title, content } = INFO_CONTENT[section];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#23272f] rounded-xl shadow-2xl p-4 md:p-8 max-w-md w-full mx-2 text-xs md:text-sm text-gray-200 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg">✕</button>
        <h3 className="font-bold text-base md:text-lg mb-2 text-green-300">{title}</h3>
        <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm">{content}</pre>
      </div>
    </div>
  );
}

function App() {
  const [userData, setUserData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const { publicKey } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(null);

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
            {navLink('/rewards', 'Rewards')}
            {navLink('/claim-nft', 'Claim your NFT')}
            <a href="https://telegram.org/" target="_blank" rel="noopener noreferrer" className="py-2 px-3 rounded hover:bg-[#23272f] text-purple-400 font-semibold">Copytrade through Aurafi</a>
            <a href="https://x.com/Aura__Fi" target="_blank" rel="noopener noreferrer" className="py-2 px-3 rounded hover:bg-[#23272f] text-blue-400 font-semibold">Twitter</a>
            <div className="mt-2">
              <WalletMultiButton className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold transition" />
            </div>
          </nav>
          <div className="hidden md:flex flex-col gap-2 text-xs text-gray-400 px-6 pb-2 mt-auto">
            <button className="hover:text-green-300 text-left" onClick={() => setInfoOpen('privacy')}>Privacy Policy</button>
            <button className="hover:text-green-300 text-left" onClick={() => setInfoOpen('legal')}>Legal Policy</button>
            <button className="hover:text-green-300 text-left" onClick={() => setInfoOpen('rules')}>Rules</button>
            <button className="hover:text-green-300 text-left" onClick={() => setInfoOpen('partners')}>Our Partners</button>
          </div>
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
            {navLink('/rewards', 'Rewards', () => setMenuOpen(false))}
            {navLink('/claim-nft', 'Claim your NFT', () => setMenuOpen(false))}
            <a href="https://telegram.org/" target="_blank" rel="noopener noreferrer" className="py-2 px-3 rounded hover:bg-[#23272f] text-purple-400 font-semibold" onClick={() => setMenuOpen(false)}>Copytrade through Aurafi</a>
            <a href="https://x.com/Aura__Fi" target="_blank" rel="noopener noreferrer" className="py-2 px-3 rounded hover:bg-[#23272f] text-blue-400 font-semibold" onClick={() => setMenuOpen(false)}>Twitter</a>
            <div className="mt-2">
              <WalletMultiButton className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold transition" />
            </div>
            <div className="border-t border-[#2e323c] mt-2 pt-2 flex flex-col gap-1 text-xs text-gray-400">
              <button className="hover:text-green-300 text-left" onClick={() => { setInfoOpen('privacy'); setMenuOpen(false); }}>Privacy Policy</button>
              <button className="hover:text-green-300 text-left" onClick={() => { setInfoOpen('legal'); setMenuOpen(false); }}>Legal Policy</button>
              <button className="hover:text-green-300 text-left" onClick={() => { setInfoOpen('rules'); setMenuOpen(false); }}>Rules</button>
              <button className="hover:text-green-300 text-left" onClick={() => { setInfoOpen('partners'); setMenuOpen(false); }}>Our Partners</button>
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
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/claim-nft" element={<ClaimNFT userData={userData} />} />
          </Routes>
        </div>
      </main>
      <InfoModal open={!!infoOpen} onClose={() => setInfoOpen(null)} section={infoOpen} />
    </div>
  );
}

export default App;
