import React from 'react';

const YapsPage = () => {
  const facts = [
    {
      id: "01",
      category: "OPEN SOURCE",
      content: "Official contributor to the Express.js organization. My first ever PR to any repo.",
      color: "#f5a623" // Gold
    },
    {
      id: "02",
      category: "CREATIVE",
      content: "I design streetwear in Figma. Two of my designs have been printed and sold over 100+ units.",
      color: "#ff0080" // Pink
    },
    {
      id: "03",
      category: "ENVIRONMENT",
      content: "Arch Linux + Neovim + Tmux. No mouse policy. If I can't do it in the terminal, I probably won't do it.",
      color: "#3fb950" // Green
    },
    {
      id: "04",
      category: "BASE",
      content: "Operating remotely from India (IST).",
      color: "#58a6ff" // Blue
    },
    {
      id: "05",
      category: "FUEL",
      content: "Powered by Dark Roast Coffee. Caffeine dependency is critical.",
      color: "#8b949e" // Gray
    },
    {
      id: "06",
      category: "AUDIO",
      content: "Coding requires specific frequencies. Usually blasting Synthwave or Lo-Fi beats.",
      color: "#7928ca" // Purple
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-white selection:text-black py-24 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-24">
            <h2 className="font-mono text-xs text-[#58a6ff] uppercase tracking-widest mb-4">
                // Random Access Memory
            </h2>
            <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none">
                Yaps.
            </h1>
        </div>

        {/* Masonry Grid - Pure Typography */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-x-12 gap-y-24 space-y-24">
            {facts.map((item) => (
                <div 
                    key={item.id}
                    className="break-inside-avoid group cursor-default"
                >
                    {/* Meta Label */}
                    <div className="flex items-center gap-3 mb-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="font-mono text-sm text-white font-bold">{item.id}</span>
                        <div 
                            className="h-px w-8 bg-[#30363d] group-hover:w-16 transition-all duration-500 ease-out"
                            style={{ backgroundColor: 'var(--hover-color)' }}
                        />
                        <span 
                            className="font-mono text-xs uppercase tracking-widest"
                            style={{ color: item.color }}
                        >
                            {item.category}
                        </span>
                    </div>

                    {/* Main Content */}
                    <p className="text-2xl md:text-3xl font-medium text-[#8b949e] group-hover:text-white transition-colors duration-300 leading-tight">
                        {item.content}
                    </p>
                </div>
            ))}
            
            {/* Footer Block */}
            <div className="break-inside-avoid pt-12">
                <p className="font-mono text-xs text-[#30363d] uppercase tracking-widest">
                    // End of Stream
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default YapsPage;