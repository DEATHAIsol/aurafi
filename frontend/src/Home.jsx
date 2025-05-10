import { useState } from 'react';

export default function Home({ onSubmit, userData, submitting }) {
  const [wallet, setWallet] = useState('');
  const [username, setUsername] = useState('');
  const [twitter, setTwitter] = useState('');
  const [typing, setTyping] = useState(false);
  const [typedText, setTypedText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTyping(true);
    setTypedText('');
    onSubmit(wallet, username, twitter);
    const fullText = 'CALCULATING AURA';
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        clearInterval(interval);
        setTimeout(() => setTyping(false), 1000); // Show full text for 1s
      }
    }, 3000 / fullText.length); // Spread typing over 3 seconds
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="w-full max-w-2xl bg-[#23272f] rounded-2xl shadow-2xl p-14 border border-[#2e323c] mb-10 animate-fade-in relative overflow-hidden">
        <h2 className="text-4xl font-extrabold mb-8 text-center">Get Your Aura Points</h2>
        {/* Typewriter effect overlay */}
        {typing && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#23272f] z-50">
            <span className="text-4xl font-mono text-green-400 animate-pulse">{typedText}<span className="border-r-2 border-green-400 animate-blink ml-1" /></span>
          </div>
        )}
        {/* Form and result */}
        {!typing && !userData && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              className="bg-[#181c24] border border-[#2e323c] rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 text-xl"
              placeholder="Solana Wallet Address"
              value={wallet}
              onChange={e => setWallet(e.target.value)}
              required
            />
            <input
              type="text"
              className="bg-[#181c24] border border-[#2e323c] rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 text-xl"
              placeholder="Username (optional)"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="text"
              className="bg-[#181c24] border border-[#2e323c] rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 text-xl"
              placeholder="Twitter Handle (optional)"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
            />
            <button
              type="submit"
              className="mt-4 py-4 text-2xl bg-green-500 hover:bg-green-400 rounded-xl font-bold transition shadow-green-700/30 shadow-lg"
              disabled={submitting}
            >
              {submitting ? 'Calculating...' : 'Submit'}
            </button>
          </form>
        )}
        {/* Show Aura Points card after submission */}
        {!typing && userData && (
          <div className="mt-10 bg-[#181c24] rounded-xl p-8 text-center border border-green-700 shadow-green-900/30 shadow-lg animate-glow">
            <h3 className="text-3xl font-bold text-green-400 mb-4">Aura Points</h3>
            <div className="text-6xl font-extrabold text-green-300 mb-4 animate-pulse">{userData.auraPoints}</div>
            <div className="flex justify-center gap-10 text-2xl mb-4">
              <span>Win Rate: <span className="font-bold text-white">{userData.winRate}</span></span>
              <span>Avg Return: <span className="font-bold text-white">{userData.avgReturn}</span></span>
            </div>
            <div className="text-lg text-gray-400">Wallet: {userData.wallet.slice(0, 4)}...{userData.wallet.slice(-4)}</div>
            {userData.twitter && (
              <div className="mt-2 text-blue-400 text-lg">@{userData.twitter}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Add blinking cursor animation
// In your index.css or App.css, add:
// .animate-blink { animation: blink 1s steps(2, start) infinite; }
// @keyframes blink { to { visibility: hidden; } } 