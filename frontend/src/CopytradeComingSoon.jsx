import React from 'react';

export default function CopytradeComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in">
      <div className="w-full max-w-2xl bg-[#23272f] rounded-2xl shadow-2xl p-8 md:p-14 border border-green-400 mb-10 animate-fade-in relative overflow-hidden mt-4 md:mt-0">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-center text-green-300 flex items-center gap-2 glow-heading">
          <span role="img" aria-label="robot">🤖</span> Copytrade with AuraFi — Coming Soon!
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-6 text-center">
          Soon you'll be able to automatically mirror the trades of top-performing wallets on Solana, directly through Telegram!<br /><br />
          Our upcoming Copytrade Bot will let you:
        </p>
        <ul className="text-base md:text-lg text-green-200 space-y-2 mb-6 list-disc list-inside">
          <li>Auto-copy the trades of elite AuraFi traders</li>
          <li>Set custom risk and allocation controls</li>
          <li>Get real-time trade alerts and performance stats</li>
          <li>Pause, resume, or customize your copytrading anytime</li>
        </ul>
        <div className="mb-8 text-center">
          <span className="inline-block bg-green-900/40 text-green-200 px-4 py-2 rounded-full text-sm font-semibold glow-green">
            🚀 Launching soon on Telegram — be the first to try it!
          </span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <a
            href="https://t.me/Aura_fibot"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-8 text-lg md:text-xl bg-green-500 hover:bg-green-400 rounded-xl font-bold transition shadow-green-700/30 shadow-lg button-glow"
          >
            Presave on Telegram
          </a>
          <div className="text-green-200 text-sm md:text-base text-center">
            Tap the button above to presave the AuraFi Copytrade Bot and get notified at launch!
          </div>
        </div>
      </div>
    </div>
  );
} 