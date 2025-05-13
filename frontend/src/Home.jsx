import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home({ onSubmit, userData, submitting, connectedWallet }) {
  const [wallet, setWallet] = useState(connectedWallet || '');
  const [username, setUsername] = useState('');
  const [twitter, setTwitter] = useState('');
  const [typing, setTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit called', { wallet, username, twitter }); // Log for iPhone debug
    const isIphone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isIphone) {
      setTyping(false);
      setTypedText('');
      onSubmit(wallet, username, twitter);
    } else {
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
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    // Calculate width/height to fit A4
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40; // 20pt margin each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const y = Math.max(40, (pageHeight - imgHeight) / 2); // Center vertically
    pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight);
    pdf.save('aura-points-card.pdf');
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    const scale = 2;
    const borderRadius = 32 * scale; // adjust if your border radius is different
    const neonGreen = '#22ff7e'; // neon green border color

    // Render the card to a canvas
    const cardCanvas = await html2canvas(cardRef.current, { scale, useCORS: true });

    // Create a new canvas with the same size
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = cardCanvas.width;
    finalCanvas.height = cardCanvas.height;
    const ctx = finalCanvas.getContext('2d');

    // Fill the background with neon green to avoid white corners
    ctx.fillStyle = neonGreen;
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Draw neon green rounded rectangle as background
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(finalCanvas.width - borderRadius, 0);
    ctx.quadraticCurveTo(finalCanvas.width, 0, finalCanvas.width, borderRadius);
    ctx.lineTo(finalCanvas.width, finalCanvas.height - borderRadius);
    ctx.quadraticCurveTo(finalCanvas.width, finalCanvas.height, finalCanvas.width - borderRadius, finalCanvas.height);
    ctx.lineTo(borderRadius, finalCanvas.height);
    ctx.quadraticCurveTo(0, finalCanvas.height, 0, finalCanvas.height - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.fill();

    // Clip to rounded rectangle and draw the card image
    ctx.save();
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(cardCanvas, 0, 0);
    ctx.restore();

    // Export as PNG
    const imgData = finalCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'aura-points-card.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    const scale = 2;
    const borderRadius = 32 * scale; // adjust if your border radius is different
    const neonGreen = '#22ff7e'; // neon green border color

    // Render the card to a canvas
    const cardCanvas = await html2canvas(cardRef.current, { scale, useCORS: true });

    // Create a new canvas with the same size
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = cardCanvas.width;
    finalCanvas.height = cardCanvas.height;
    const ctx = finalCanvas.getContext('2d');

    // Fill the background with neon green to avoid white corners
    ctx.fillStyle = neonGreen;
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Draw neon green rounded rectangle as background
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(finalCanvas.width - borderRadius, 0);
    ctx.quadraticCurveTo(finalCanvas.width, 0, finalCanvas.width, borderRadius);
    ctx.lineTo(finalCanvas.width, finalCanvas.height - borderRadius);
    ctx.quadraticCurveTo(finalCanvas.width, finalCanvas.height, finalCanvas.width - borderRadius, finalCanvas.height);
    ctx.lineTo(borderRadius, finalCanvas.height);
    ctx.quadraticCurveTo(0, finalCanvas.height, 0, finalCanvas.height - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.fill();

    // Clip to rounded rectangle and draw the card image
    ctx.save();
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(cardCanvas, 0, 0);
    ctx.restore();

    // Copy the final canvas as PNG to clipboard or download
    finalCanvas.toBlob(async (blob) => {
      try {
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new window.ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } else {
          // Fallback for older browsers
          const imgData = finalCanvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imgData;
          link.download = 'aura-points-card.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert('Image copied to clipboard not supported. Image downloaded instead.');
        }
      } catch (err) {
        console.error('Error copying image:', err);
        alert('Failed to copy image. Please try again.');
      }
    }, 'image/png');
  };

  // Update wallet field if connectedWallet changes
  useEffect(() => {
    if (connectedWallet && connectedWallet !== wallet) {
      setWallet(connectedWallet);
    }
  }, [connectedWallet]);

  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
          <>
            <div ref={cardRef} className="mt-6 md:mt-10 bg-[#181c24] rounded-xl p-4 md:p-8 text-center border border-green-700 shadow-green-900/30 shadow-lg animate-glow relative overflow-hidden">
              {/* Card background image */}
              <img
                src="/card-bg.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ zIndex: 0 }}
              />
              {/* Card content */}
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold text-green-400 mb-1 md:mb-2">Aura Points</h3>
                <div className="text-6xl md:text-7xl font-extrabold text-green-300 mb-2 md:mb-4 animate-pulse">{userData.auraPoints}</div>
                <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-10 text-sm md:text-base mb-2 md:mb-4 text-gray-200/90">
                  <span className="text-gray-200/90">Win Rate: <span className="font-bold text-white/90">{userData.winRate}</span></span>
                  <span className="text-gray-200/90">Avg Return: <span className="font-bold text-white/90">{userData.avgReturn}</span></span>
                </div>
                {/* Twitter handle first, then wallet, no username, moved down */}
                <div className="mt-6">
                  {userData.twitter && (
                    <div className="text-gray-200/90 text-base md:text-lg mb-1">@{userData.twitter}</div>
                  )}
                  <div className="text-sm md:text-base text-gray-400">Wallet: {userData.wallet.slice(0, 4)}...{userData.wallet.slice(-4)}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-center justify-center mt-4">
              <button
                onClick={handleDownloadPNG}
                className="py-3 px-8 text-lg md:text-xl bg-green-500 hover:bg-green-400 rounded-xl font-bold transition shadow-green-700/30 shadow-lg button-glow"
              >
                Download as PNG
              </button>
              {!isMobile && (
                <button
                  onClick={handleCopyImage}
                  className="py-3 px-8 text-lg md:text-xl bg-blue-500 hover:bg-blue-400 rounded-xl font-bold transition shadow-blue-700/30 shadow-lg button-glow"
                >
                  Copy Image
                </button>
              )}
            </div>
            {copied && (
              <div className="text-xs text-green-400 mt-2 animate-fade-in">Copied</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Add blinking cursor animation
// In your index.css or App.css, add:
// .animate-blink { animation: blink 1s steps(2, start) infinite; }
// @keyframes blink { to { visibility: hidden; } } 