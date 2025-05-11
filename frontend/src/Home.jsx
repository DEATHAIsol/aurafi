import { useState, useEffect } from 'react';

export default function Home({ onSubmit, userData, submitting, connectedWallet }) {
  const [wallet, setWallet] = useState(connectedWallet || '');
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

  // Update wallet field if connectedWallet changes
  useEffect(() => {
    if (connectedWallet && connectedWallet !== wallet) {
      setWallet(connectedWallet);
    }
  }, [connectedWallet]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-0">
      <div className="w-full max-w-2xl bg-[#23272f] rounded-2xl shadow-2xl p-4 md:p-14 border border-[#2e323c] mb-10 animate-fade-in relative overflow-hidden mt-4 md:mt-0">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-center glow-heading">Get Your Aura Points</h2>
        {/* Typewriter effect overlay */}
        {typing && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#23272f] z-50">
            <span className="text-2xl md:text-4xl font-mono text-green-400 animate-pulse">{typedText}<span className="border-r-2 border-green-400 animate-blink ml-1" /></span>
          </div>
        )}
        {/* Form and result */}
        {!typing && !userData && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
            <input
              type="text"
              className="bg-[#181c24] border border-[#2e323c] rounded-xl px-4 py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 text-lg md:text-xl input-glow"
              placeholder="Solana Wallet Address"
              value={wallet}
              onChange={e => setWallet(e.target.value)}
              required
            />
            <input
              type="text"
              className="bg-[#181c24] border border-[#2e323c] rounded-xl px-4 py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 text-lg md:text-xl input-glow"
              placeholder="Username (optional)"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="text"
              className="bg-[#181c24] border border-[#2e323c] rounded-xl px-4 py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 text-lg md:text-xl input-glow"
              placeholder="Twitter Handle (optional)"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 md:mt-4 py-3 md:py-4 text-xl md:text-2xl bg-green-500 hover:bg-green-400 rounded-xl font-bold transition shadow-green-700/30 shadow-lg button-glow"
              disabled={submitting}
            >
              {submitting ? 'Calculating...' : 'Submit'}
            </button>
          </form>
        )}
        {/* Show Aura Points card after submission */}
        {!typing && userData && (
          <div className="mt-6 md:mt-10 bg-[#181c24] rounded-xl p-4 md:p-8 text-center border border-green-700 shadow-green-900/30 shadow-lg animate-glow">
            <h3 className="text-2xl md:text-3xl font-bold text-green-400 mb-2 md:mb-4">Aura Points</h3>
            <div className="text-4xl md:text-6xl font-extrabold text-green-300 mb-2 md:mb-4 animate-pulse">{userData.auraPoints}</div>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-10 text-lg md:text-2xl mb-2 md:mb-4">
              <span>Win Rate: <span className="font-bold text-white">{userData.winRate}</span></span>
              <span>Avg Return: <span className="font-bold text-white">{userData.avgReturn}</span></span>
            </div>
            <div className="text-base md:text-lg text-gray-400">Wallet: {userData.wallet.slice(0, 4)}...{userData.wallet.slice(-4)}</div>
            {userData.twitter && (
              <div className="mt-2 text-blue-400 text-base md:text-lg">@{userData.twitter}</div>
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