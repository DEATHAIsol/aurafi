import React from 'react';

export default function Rewards() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in">
      <div className="w-full max-w-2xl bg-[#23272f] rounded-2xl shadow-2xl p-8 md:p-14 border border-[#2e323c] mb-10 animate-fade-in relative overflow-hidden mt-4 md:mt-0">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-center text-green-300 flex items-center gap-2">
          <span role="img" aria-label="trophy">🏆</span> Rewards Program
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-6 text-center">
          Aura Points rewards the sharpest traders every week with a share of <span className="text-yellow-300 font-bold">10 SOL</span>.<br />
          Rankings are determined purely by your <span className="text-green-300 font-bold">Aura Points</span> score — which measures consistency and profitability on Solana memecoins.
        </p>
        <div className="mb-6 text-center">
          <span className="inline-block bg-green-900/40 text-green-200 px-4 py-2 rounded-full text-sm font-semibold">
            Rewards are distributed every Sunday, with the next drop scheduled for <span className="text-yellow-200 font-bold">Sunday, 18 May</span>.
          </span>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-green-300 mb-2">💰 Weekly Reward Breakdown:</h3>
          <ul className="text-base md:text-lg text-gray-100 space-y-1">
            <li><span role="img" aria-label="1st">🥇</span> <span className="font-bold">1st Place</span> — <span className="text-yellow-300 font-bold">3.0 SOL</span></li>
            <li><span role="img" aria-label="2nd">🥈</span> <span className="font-bold">2nd Place</span> — <span className="text-yellow-200 font-bold">2.0 SOL</span></li>
            <li><span role="img" aria-label="3rd">🥉</span> <span className="font-bold">3rd Place</span> — <span className="text-yellow-100 font-bold">1.0 SOL</span></li>
            <li><span role="img" aria-label="4th-5th">🏅</span> <span className="font-bold">4th–5th Place</span> — <span className="text-green-200 font-bold">0.5 SOL each</span></li>
            <li><span role="img" aria-label="6th-15th">🎯</span> <span className="font-bold">6th–15th Place</span> — <span className="text-green-100 font-bold">0.3 SOL each</span></li>
          </ul>
          <div className="mt-2 text-base md:text-lg text-green-400 font-bold">📊 Total Weekly Distribution = 10.0 SOL</div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-green-300 mb-2">🕒 Timing:</h3>
          <ul className="text-base md:text-lg text-gray-100 space-y-1">
            <li>Rewards snapshot is taken every <span className="font-bold">Saturday at 23:59 UTC</span></li>
            <li>Payouts are sent automatically every <span className="font-bold">Sunday</span></li>
            <li>Funds are transferred directly to your submitted Solana wallet — <span className="font-bold">no claiming needed</span></li>
          </ul>
        </div>
        <div className="text-center text-green-200 text-base md:text-lg mt-4">
          Stay consistent, trade smart, and climb the leaderboard to earn your share. <br />Let your Aura speak.
        </div>
      </div>
    </div>
  );
} 