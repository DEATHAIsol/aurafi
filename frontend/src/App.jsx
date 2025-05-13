import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import Leaderboard from './Leaderboard';
import ClaimNFT from './ClaimNFT';
import Rewards from './Rewards';
import CopytradeComingSoon from './CopytradeComingSoon';
import './App.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import LeaderboardTicker from './LeaderboardTicker';
import { isMobile } from 'react-device-detect';
import MobileApp from './MobileApp';

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
  if (isMobile) {
    return <MobileApp />;
  }
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
      <div className="background-effect"></div>
      <svg className="background-lines" width="100%" height="100%" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#39ff14" flood-opacity="0.8" />
          </filter>
          <filter id="glowBold" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#7fff00" flood-opacity="1" />
          </filter>
        </defs>
        {/* Vertical lines */}
        <line x1="80" y1="0" x2="80" y2="900" stroke="#39ff14" strokeWidth="1.2"/>
        <line x1="180" y1="0" x2="180" y2="900" stroke="#39ff14" strokeWidth="0.7"/>
        <line x1="300" y1="0" x2="300" y2="900" stroke="#39ff14" strokeWidth="1.5"/>
        <line x1="420" y1="0" x2="420" y2="900" stroke="#39ff14" strokeWidth="0.8"/>
        <line x1="540" y1="0" x2="540" y2="900" stroke="#39ff14" strokeWidth="1.1"/>
        <line x1="650" y1="0" x2="650" y2="900" stroke="#39ff14" strokeWidth="0.7"/>
        <line x1="800" y1="0" x2="800" y2="900" stroke="#39ff14" strokeWidth="2"/>
        <line x1="950" y1="0" x2="950" y2="900" stroke="#39ff14" strokeWidth="1.3"/>
        <line x1="1100" y1="0" x2="1100" y2="900" stroke="#39ff14" strokeWidth="0.9"/>
        <line x1="1200" y1="0" x2="1200" y2="900" stroke="#39ff14" strokeWidth="1.7"/>
        <line x1="1350" y1="0" x2="1350" y2="900" stroke="#39ff14" strokeWidth="1.1"/>
        <line x1="1500" y1="0" x2="1500" y2="900" stroke="#39ff14" strokeWidth="0.8"/>
        {/* Horizontal lines */}
        <line x1="0" y1="120" x2="1600" y2="120" stroke="#39ff14" strokeWidth="0.7"/>
        <line x1="0" y1="200" x2="1600" y2="200" stroke="#39ff14" strokeWidth="1.2"/>
        <line x1="0" y1="320" x2="1600" y2="320" stroke="#39ff14" strokeWidth="0.8"/>
        <line x1="0" y1="400" x2="1600" y2="400" stroke="#39ff14" strokeWidth="1.5"/>
        <line x1="0" y1="520" x2="1600" y2="520" stroke="#39ff14" strokeWidth="0.9"/>
        <line x1="0" y1="600" x2="1600" y2="600" stroke="#39ff14" strokeWidth="1.7"/>
        <line x1="0" y1="720" x2="1600" y2="720" stroke="#39ff14" strokeWidth="1.1"/>
        <line x1="0" y1="800" x2="1600" y2="800" stroke="#39ff14" strokeWidth="0.7"/>
        {/* Diagonal lines */}
        <line x1="0" y1="0" x2="1600" y2="900" stroke="#39ff14" strokeWidth="1.5" filter="url(#glow)"/>
        <line x1="0" y1="900" x2="1600" y2="0" stroke="#7fff00" strokeWidth="2.5" filter="url(#glowBold)"/>
        <line x1="300" y1="0" x2="1300" y2="900" stroke="#39ff14" strokeWidth="2.2"/>
        <line x1="0" y1="600" x2="1600" y2="100" stroke="#7fff00" strokeWidth="1.2" filter="url(#glow)"/>
        <line x1="800" y1="0" x2="1600" y2="900" stroke="#39ff14" strokeWidth="2.8"/>
        <line x1="0" y1="300" x2="1600" y2="700" stroke="#7fff00" strokeWidth="1.7"/>
        {/* Circles for extra effect */}
        <circle cx="200" cy="150" r="60" fill="#39ff14" opacity="0.12"/>
        <circle cx="1400" cy="200" r="40" fill="#39ff14" opacity="0.18"/>
        <circle cx="800" cy="700" r="90" fill="#39ff14" opacity="0.09"/>
        <circle cx="1200" cy="600" r="50" fill="#39ff14" opacity="0.15"/>
        <circle cx="400" cy="800" r="70" fill="#39ff14" opacity="0.10"/>
        <circle cx="1000" cy="300" r="30" fill="#39ff14" opacity="0.22"/>
        <circle cx="300" cy="400" r="40" fill="#39ff14" opacity="0.13"/>
        <circle cx="1500" cy="800" r="60" fill="#39ff14" opacity="0.08"/>
        <circle cx="600" cy="200" r="35" fill="#39ff14" opacity="0.19"/>
        <circle cx="900" cy="100" r="55" fill="#39ff14" opacity="0.11"/>
        <circle cx="1300" cy="700" r="45" fill="#39ff14" opacity="0.14"/>
        <circle cx="200" cy="700" r="30" fill="#39ff14" opacity="0.20"/>
        <circle cx="700" cy="500" r="60" fill="#39ff14" opacity="0.09"/>
        <circle cx="1100" cy="800" r="50" fill="#39ff14" opacity="0.13"/>
        <circle cx="500" cy="300" r="40" fill="#39ff14" opacity="0.16"/>
        <circle cx="100" cy="500" r="35" fill="#39ff14" opacity="0.18"/>
        <circle cx="1500" cy="100" r="55" fill="#39ff14" opacity="0.10"/>
        <circle cx="800" cy="400" r="80" fill="#39ff14" opacity="0.07"/>
        <circle cx="600" cy="600" r="45" fill="#39ff14" opacity="0.15"/>
        <circle cx="400" cy="100" r="30" fill="#39ff14" opacity="0.21"/>
        {/* Extra glowing circles */}
        <circle cx="350" cy="250" r="38" fill="#39ff14" opacity="0.28"/>
        <circle cx="1550" cy="400" r="22" fill="#39ff14" opacity="0.32"/>
        <circle cx="120" cy="850" r="44" fill="#39ff14" opacity="0.25"/>
        <circle cx="1450" cy="850" r="33" fill="#39ff14" opacity="0.29"/>
        <circle cx="1000" cy="850" r="28" fill="#39ff14" opacity="0.31"/>
        <circle cx="700" cy="120" r="36" fill="#39ff14" opacity="0.27"/>
        <circle cx="1100" cy="200" r="41" fill="#39ff14" opacity="0.30"/>
        <circle cx="300" cy="600" r="25" fill="#39ff14" opacity="0.33"/>
        <circle cx="150" cy="350" r="32" fill="#39ff14" opacity="0.26"/>
        <circle cx="1350" cy="100" r="39" fill="#39ff14" opacity="0.34"/>
        <circle cx="500" cy="700" r="29" fill="#39ff14" opacity="0.28"/>
        <circle cx="900" cy="800" r="37" fill="#39ff14" opacity="0.32"/>
        <circle cx="1250" cy="500" r="34" fill="#39ff14" opacity="0.27"/>
        <circle cx="400" cy="500" r="31" fill="#39ff14" opacity="0.29"/>
        <circle cx="100" cy="100" r="27" fill="#39ff14" opacity="0.35"/>
        <circle cx="1500" cy="600" r="42" fill="#39ff14" opacity="0.30"/>
        <circle cx="800" cy="200" r="35" fill="#39ff14" opacity="0.33"/>
        <circle cx="600" cy="350" r="30" fill="#39ff14" opacity="0.31"/>
        <circle cx="1400" cy="300" r="40" fill="#39ff14" opacity="0.28"/>
        <circle cx="1000" cy="100" r="26" fill="#39ff14" opacity="0.36"/>
        {/* New random diagonal lines */}
        <line x1="100" y1="0" x2="1500" y2="900" stroke="#39ff14" strokeWidth="2.5" filter="url(#glow)"/>
        <line x1="0" y1="200" x2="1200" y2="900" stroke="#7fff00" strokeWidth="3.2" filter="url(#glowBold)"/>
        <line x1="400" y1="0" x2="1600" y2="800" stroke="#39ff14" strokeWidth="1.1"/>
        <line x1="0" y1="800" x2="1200" y2="0" stroke="#7fff00" strokeWidth="2.9" filter="url(#glow)"/>
        <line x1="200" y1="900" x2="1400" y2="0" stroke="#39ff14" strokeWidth="2.3"/>
        <line x1="0" y1="500" x2="1600" y2="200" stroke="#7fff00" strokeWidth="1.8" filter="url(#glowBold)"/>
        <line x1="600" y1="0" x2="1600" y2="600" stroke="#39ff14" strokeWidth="2.7"/>
        <line x1="0" y1="100" x2="1000" y2="900" stroke="#7fff00" strokeWidth="1.3"/>
        <line x1="100" y1="900" x2="1500" y2="0" stroke="#39ff14" strokeWidth="2.1" filter="url(#glow)"/>
        <line x1="0" y1="400" x2="1600" y2="850" stroke="#7fff00" strokeWidth="2.6" filter="url(#glowBold)"/>
        <line x1="800" y1="900" x2="1600" y2="100" stroke="#39ff14" strokeWidth="1.9"/>
        <line x1="0" y1="700" x2="1200" y2="0" stroke="#7fff00" strokeWidth="2.2" filter="url(#glow)"/>
        <line x1="400" y1="900" x2="1600" y2="200" stroke="#39ff14" strokeWidth="2.4"/>
        <line x1="0" y1="600" x2="1000" y2="0" stroke="#7fff00" strokeWidth="1.6" filter="url(#glowBold)"/>
      </svg>
      <div className="flex-1 flex flex-col min-h-0 min-w-0 relative z-10 md:pt-[2.5rem]">
        <LeaderboardTicker />
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#20242c] flex-col justify-between items-stretch border-r border-[#23272f] pt-8 pb-8 z-20">
          <div className="flex flex-col flex-1 px-6">
            <Link to="/" className="block mt-6 mb-10">
              <h1 className="text-4xl font-bold text-green-400 tracking-wide glow-heading animate-pulse cursor-pointer">Aura Fi</h1>
            </Link>
            <nav className="flex flex-col gap-4 text-lg">
              {navLink('/', 'Home')}
              {navLink('/leaderboard', 'Leaderboard')}
              {navLink('/rewards', 'Rewards')}
              {navLink('/claim-nft', 'Claim your NFT')}
              <Link to="/copytrade-coming-soon" className="py-2 px-3 rounded font-semibold text-white">Copytrade through Aurafi</Link>
              <a href="https://x.com/Aura__Fi" target="_blank" rel="noopener noreferrer" className="py-2 px-3 rounded font-semibold text-white">Twitter</a>
              <div className="mt-2">
                <WalletMultiButton className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold transition button-glow" />
              </div>
            </nav>
            <div className="hidden md:flex flex-col gap-2 text-xs text-gray-400 px-6 pb-2 mt-auto">
              <button className="info-btn" onClick={() => setInfoOpen('privacy')}>Privacy Policy</button>
              <button className="info-btn" onClick={() => setInfoOpen('legal')}>Legal Policy</button>
              <button className="info-btn" onClick={() => setInfoOpen('rules')}>Rules</button>
              <button className="info-btn" onClick={() => setInfoOpen('partners')}>Our Partners</button>
            </div>
          </div>
        </aside>
        {/* Mobile Top Bar */}
        <header className="md:hidden fixed top-0 left-0 w-full bg-[#20242c] flex items-center justify-between px-4 py-3 border-b border-[#23272f] z-30">
          <h1 className="text-lg font-bold text-green-400 tracking-wide pl-2" style={{maxWidth: '70vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>Aura_Fi</h1>
          <button
            className="text-white focus:outline-none ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
            style={{zIndex: 50}}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        {/* Dropdown menu */}
          {menuOpen && (
            <div className="fixed top-16 left-0 w-full bg-[#23272f] rounded-b-lg shadow-lg flex flex-col gap-4 py-6 px-6 animate-fade-in z-40">
              {navLink('/', 'Home', () => setMenuOpen(false))}
              {navLink('/leaderboard', 'Leaderboard', () => setMenuOpen(false))}
              {navLink('/rewards', 'Rewards', () => setMenuOpen(false))}
              {navLink('/claim-nft', 'Claim your NFT', () => setMenuOpen(false))}
              <Link to="/copytrade-coming-soon" className="py-2 px-3 rounded font-semibold text-white" onClick={() => setMenuOpen(false)}>Copytrade through Aurafi</Link>
              <a href="https://x.com/Aura__Fi" target="_blank" rel="noopener noreferrer" className="py-2 px-3 rounded font-semibold text-white" onClick={() => setMenuOpen(false)}>Twitter</a>
              <div className="mt-2">
                <WalletMultiButton className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold transition button-glow" />
              </div>
              <div className="border-t border-[#2e323c] mt-2 pt-2 flex flex-col gap-1 text-xs text-gray-400">
                <button className="info-btn" onClick={() => { setInfoOpen('privacy'); setMenuOpen(false); }}>Privacy Policy</button>
                <button className="info-btn" onClick={() => { setInfoOpen('legal'); setMenuOpen(false); }}>Legal Policy</button>
                <button className="info-btn" onClick={() => { setInfoOpen('rules'); setMenuOpen(false); }}>Rules</button>
                <button className="info-btn" onClick={() => { setInfoOpen('partners'); setMenuOpen(false); }}>Our Partners</button>
              </div>
            </div>
          )}
        </header>
        {/* Main Content */}
        <main className="flex-1 h-screen min-h-0 min-w-0 md:ml-64 p-0 m-0 relative overflow-auto pt-16 md:pt-0">
          {/* Hide SVG background on mobile, show on md+ */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" />
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-1 md:px-0 pb-8 md:pb-0" style={{overflow: 'auto'}}>
            <Routes>
              <Route path="/" element={<Home onSubmit={handleHomeSubmit} userData={userData} submitting={submitting} connectedWallet={publicKey?.toBase58() || ''} />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/claim-nft" element={<ClaimNFT userData={userData} />} />
              <Route path="/copytrade-coming-soon" element={<CopytradeComingSoon />} />
            </Routes>
          </div>
        </main>
        <InfoModal open={!!infoOpen} onClose={() => setInfoOpen(null)} section={infoOpen} />
      </div>
    </div>
  );
}

export default App;
