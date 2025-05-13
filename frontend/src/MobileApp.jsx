import React, { useState } from 'react';
import Home from './Home';
import Leaderboard from './Leaderboard';
import Rewards from './Rewards';
import ClaimNFT from './ClaimNFT';
import CopytradeComingSoon from './CopytradeComingSoon';

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
      <div className="bg-[#23272f] rounded-xl shadow-2xl p-4 max-w-md w-full mx-2 text-xs text-gray-200 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg">✕</button>
        <h3 className="font-bold text-base mb-2 text-green-300">{title}</h3>
        <pre className="whitespace-pre-wrap font-sans text-xs">{content}</pre>
      </div>
    </div>
  );
}

export default function MobileApp({ userData, submitting, onSubmit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState('home');
  const [infoOpen, setInfoOpen] = useState(null);

  let content;
  if (page === 'home') content = <Home onSubmit={onSubmit} userData={userData} submitting={submitting} />;
  else if (page === 'leaderboard') content = <Leaderboard />;
  else if (page === 'rewards') content = <Rewards />;
  else if (page === 'claim-nft') content = <ClaimNFT userData={userData} />;
  else if (page === 'copytrade') content = <CopytradeComingSoon />;

  const handleSubmit = async (wallet, username, twitter) => {
    console.log('handleSubmit called', { wallet, username, twitter });
    const url = `${API_URL}/api/submit-wallet`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet, username, twitter }),
      });
      console.log('Backend response status:', res.status);
      const data = await res.json();
      console.log('Backend response data:', data);
      setUserData(data);
      console.log('userData set:', data);
    } catch (err) {
      console.error('Backend error:', err);
      setUserData(null);
      alert('Failed to submit wallet. Please try again.');
    }
  };

  return (
    <div className="h-screen w-full pt-16 pb-8 relative" style={{ background: '#23272f', overflow: 'visible' }}>
      {/* Green haze on left and right edges only, outside scrollable area */}
      <div className="absolute top-0 left-0 h-full w-16 -z-10 pointer-events-none" style={{
        background: 'radial-gradient(circle at 0% 50%, #39ff14aa 0%, #23272f 80%)',
        filter: 'blur(12px)',
        opacity: 0.5
      }} />
      <div className="absolute top-0 right-0 h-full w-16 -z-10 pointer-events-none" style={{
        background: 'radial-gradient(circle at 100% 50%, #39ff14aa 0%, #23272f 80%)',
        filter: 'blur(12px)',
        opacity: 0.5
      }} />
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-14 z-30 flex items-center justify-between px-4" style={{ background: '#181B23', maxWidth: '100vw' }}>
        <span className="font-bold" style={{ color: '#50FA7B', fontSize: 24, fontFamily: 'Inter, monospace, sans-serif', letterSpacing: '0.02em' }}>AuraFi</span>
        <button
          className="focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
          style={{ background: 'white', border: 'none', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 40 }}
        >
          <span style={{ display: 'block', width: 20, height: 2, background: '#23272f', borderRadius: 1, margin: '3px 0' }}></span>
          <span style={{ display: 'block', width: 20, height: 2, background: '#23272f', borderRadius: 1, margin: '3px 0' }}></span>
          <span style={{ display: 'block', width: 20, height: 2, background: '#23272f', borderRadius: 1, margin: '3px 0' }}></span>
        </button>
        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute top-14 right-4 bg-[#23272f] rounded-lg shadow-lg flex flex-col gap-4 py-4 px-6 animate-fade-in z-40 w-56">
            <button className="text-green-400 font-bold text-lg text-left" onClick={() => { setPage('home'); setMenuOpen(false); }}>Home</button>
            <button className="text-green-400 font-bold text-lg text-left" onClick={() => { setPage('leaderboard'); setMenuOpen(false); }}>Leaderboard</button>
            <button className="text-green-400 font-bold text-lg text-left" onClick={() => { setPage('rewards'); setMenuOpen(false); }}>Rewards</button>
            <button className="text-green-400 font-bold text-lg text-left" onClick={() => { setPage('claim-nft'); setMenuOpen(false); }}>Claim NFT</button>
            <button className="text-green-400 font-bold text-lg text-left" onClick={() => { setPage('copytrade'); setMenuOpen(false); }}>Copytrade</button>
            <hr className="my-2 border-green-900" />
            <button className="text-gray-300 text-left" onClick={() => { setInfoOpen('privacy'); setMenuOpen(false); }}>Privacy Policy</button>
            <button className="text-gray-300 text-left" onClick={() => { setInfoOpen('legal'); setMenuOpen(false); }}>Legal Policy</button>
            <button className="text-gray-300 text-left" onClick={() => { setInfoOpen('rules'); setMenuOpen(false); }}>Rules</button>
            <button className="text-gray-300 text-left" onClick={() => { setInfoOpen('partners'); setMenuOpen(false); }}>Our Partners</button>
          </div>
        )}
      </header>
      {/* Main Content (scrollable) */}
      <div className="w-full max-w-md mx-auto px-4 bg-[#23272f] rounded-2xl shadow-2xl p-8 border border-[#2e323c] mb-4 mt-4 flex flex-col items-center overflow-y-auto" style={{ maxHeight: 'calc(100vh - 5rem)' }}>
        {content}
      </div>
      <InfoModal open={!!infoOpen} onClose={() => setInfoOpen(null)} section={infoOpen} />
    </div>
  );
} 