import { useState } from 'react';

const NFTS = [
  {
    name: 'Bronze',
    img: '/placeholder.jpg',
    minPoints: 0,
    color: 'border-amber-700',
    label: 'Bronze NFT',
  },
  {
    name: 'Silver',
    img: '/placeholder.jpg',
    minPoints: 600,
    color: 'border-gray-400',
    label: 'Silver NFT',
  },
  {
    name: 'Gold',
    img: '/placeholder.jpg',
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
                className={`relative w-full md:w-64 h-80 bg-[#181c24] rounded-2xl overflow-hidden shadow-2xl border-4 ${nft.color} flex flex-col items-center justify-end transition-transform hover:scale-105 ${eligible ? 'ring-4 ring-green-400' : 'opacity-60'} mb-6 md:mb-0`}
              >
                <img
                  src={nft.img}
                  alt={nft.label}
                  className="w-full h-56 object-cover animate-nft-spin"
                />
                <div className="absolute top-2 left-2 bg-black/60 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest">
                  {nft.name}
                </div>
                <div className="w-full text-center py-3 text-lg font-bold text-green-200 bg-gradient-to-t from-green-900/80 to-transparent">
                  {nft.label}
                </div>
                {eligible && (
                  <div className="absolute bottom-4 left-0 right-0 text-center text-green-400 font-bold animate-pulse text-xl">You Qualify!</div>
                )}
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