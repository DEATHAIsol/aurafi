import { useState } from 'react';

const NFTS = [
  {
    name: 'Bronze',
    img: '/bronze.jpg',
    minPoints: 0,
    color: 'border-amber-700',
    label: 'Bronze NFT',
  },
  {
    name: 'Silver',
    img: '/silver.jpg',
    minPoints: 600,
    color: 'border-gray-400',
    label: 'Silver NFT',
  },
  {
    name: 'Gold',
    img: '/gold.jpg',
    minPoints: 1200,
    color: 'border-yellow-400',
    label: 'Gold NFT',
  },
];

export default function ClaimNFT({ userData }) {
  // Assume userData.auraPoints is available if passed
  const points = userData?.auraPoints || 0;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in">
      <div className="w-full max-w-5xl bg-[#23272f] rounded-2xl shadow-2xl p-14 border border-[#2e323c] flex flex-col items-center">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-green-300 tracking-wide">Claim Your NFT</h2>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center mb-10 w-full">
          {NFTS.map((nft, i) => {
            const eligible = points >= nft.minPoints;
            return (
              <div
                key={nft.name}
                className={`relative w-full md:w-64 aspect-square bg-[#181c24] rounded-2xl overflow-hidden shadow-2xl border-4 ${nft.color} flex flex-col items-stretch justify-end transition-transform hover:scale-105 ${eligible ? 'ring-4 ring-green-400' : 'opacity-60'} mb-6 md:mb-0`}
              >
                <div className="relative w-full flex-1">
                  <img
                    src={nft.img}
                    alt={nft.label}
                    className="w-full h-full object-cover absolute inset-0"
                    style={{ aspectRatio: '1 / 1' }}
                  />
                  <div className="absolute top-2 left-2 bg-black/60 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest z-10">
                    {nft.name}
                  </div>
                </div>
                <div className="w-full text-center py-3 text-lg font-bold text-green-200 bg-gradient-to-t from-green-900/80 to-transparent">
                  {nft.label}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <div className="text-2xl font-bold text-green-400 mb-2 animate-pulse">🚧 Coming Soon 🚧</div>
          <div className="text-green-200">NFT claiming will be available soon.<br />Stay tuned!</div>
        </div>
      </div>
    </div>
  );
} 