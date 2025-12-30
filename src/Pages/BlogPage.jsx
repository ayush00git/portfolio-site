import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Calendar, Clock, Search, X, ChevronRight, Terminal as TerminalIcon, Hash } from 'lucide-react';

const BlogPage = () => {
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        document.body.style.overflow = selectedPost ? 'hidden' : 'unset';
    }, [selectedPost]);

    const posts = [
        {
            id: 1,
            title: "The Death of the Monolith",
            excerpt: "Breaking down a legacy Node.js application into scalable microservices using gRPC and RabbitMQ.",
            date: "Dec 28, 2024",
            readTime: "8 min read",
            tags: ["System Design", "Microservices"],
            color: "#ff0080",
            content: `
        <h3>The Breaking Point</h3>
        <p>It started with a simple timeout error. Our monolithic Node.js backend, which had served us faithfully for three years, was finally buckling under the weight of 50k concurrent connections. The event loop was blocked, garbage collection was thrashing, and deployment took 45 minutes.</p>
        <p>We had two choices: vertical scaling (throwing money at AWS) or decomposing the beast.</p>
        <h3>The Strategy: Strangler Fig Pattern</h3>
        <p>We didn't rewrite everything at once. We identified the "hottest" bounded context—the Notification Service—and extracted it first.</p>
        <pre><code class="language-javascript">
// The Old Way (In-Memory Tightly Coupled)
const sendNotification = async (userId, message) => {
  const user = await User.findById(userId);
  await emailService.send(user.email, message);
};
        </code></pre>
        <p>Moving to a distributed architecture meant introducing <strong>gRPC</strong> for low-latency inter-service communication and <strong>RabbitMQ</strong> for asynchronous tasks like email delivery. The latency overhead was negligible compared to the unblocked event loop gains.</p>
      `
        },
        {
            id: 2,
            title: "Switched to Neovim",
            excerpt: "It wasn't just about looking cool. It was about speed, muscle memory, and owning my environment.",
            date: "Dec 15, 2024",
            readTime: "5 min read",
            tags: ["Productivity", "Tools"],
            color: "#7928ca",
            content: `
        <h3>The Mouse is the Enemy</h3>
        <p>Every time you reach for the mouse, you break your flow state. VS Code is fantastic, but it encourages a "point and click" mentality. Neovim forces you to think in keyboard shortcuts and motions.</p>
        <h3>My Config Journey</h3>
        <p>Starting with bare vim is masochism. I recommend <strong>LazyVim</strong> or <strong>NvChad</strong> for beginners. Here is a snippet of my Lua config for LSP attachment:</p>
        <pre><code class="language-lua">
-- lsp-config.lua
on_attach = function(client, bufnr)
  local opts = { noremap=true, silent=true }
  vim.api.nvim_buf_set_keymap(bufnr, 'n', 'gd', '<cmd>lua vim.lsp.buf.definition()<CR>', opts)
end
        </code></pre>
        <p>Once you learn <code>ciw</code> (change inner word) or <code>dt"</code> (delete to quote), you can never go back to holding backspace.</p>
      `
        },
        {
            id: 3,
            title: "React Server Components",
            excerpt: "A deep dive into the architecture of Next.js 13+ and how RSCs change data fetching.",
            date: "Nov 30, 2024",
            readTime: "12 min read",
            tags: ["Frontend", "React"],
            color: "#0070f3",
            content: `
        <h3>The Waterfall Problem</h3>
        <p>Traditional React apps often suffer from "fetch waterfalls"—component A fetches, renders, then component B fetches. RSCs solve this by moving data fetching to the server, where latency to the DB is near zero.</p>
        <h3>Server vs. Client Components</h3>
        <p>The mental model shift is tricky. By default, everything in the App Router is a Server Component. You only "opt-in" to client-side interactivity with the <code>'use client'</code> directive.</p>
        <p>This drastically reduces bundle size. Libraries like <code>moment.js</code> or heavy markdown parsers stay on the server and never touch the browser.</p>
      `
        },
        {
            id: 4,
            title: "Rust for JS Developers",
            excerpt: "The borrow checker is scary, but the performance is worth it. Mapping JS concepts to Rust.",
            date: "Nov 12, 2024",
            readTime: "15 min read",
            tags: ["Rust", "Learning"],
            color: "#f5a623",
            content: `
        <h3>Memory Management without GC</h3>
        <p>JavaScript has a Garbage Collector (GC). C++ requires manual memory management. Rust finds the middle ground: <strong>Ownership & Borrowing</strong>.</p>
        <p>In JS, you pass objects around freely. In Rust, variables have a single owner. When the owner goes out of scope, memory is freed immediately. No GC pauses.</p>
        <h3>The Result</h3>
        <p>Predictable performance. This is why tools like Vercel's Turbopack and SWC are being rewritten in Rust. It's the future of web tooling.</p>
      `
        },
        {
            id: 5,
            title: "Designing Dark Mode",
            excerpt: "Why starting with a dark palette creates better contrast hierarchies.",
            date: "Oct 28, 2024",
            readTime: "6 min read",
            tags: ["Design", "UI/UX"],
            color: "#ffffff",
            content: `
        <h3>Light is the Absence of Data</h3>
        <p>Screens emit light. Dark mode reduces eye strain, but designing for it isn't just "inverting colors". It requires a careful system of elevations.</p>
        <h3>Elevation Strategy</h3>
        <p>In Material Design, higher surfaces are lighter gray, not black. Pure black (<code>#000000</code>) causes smearing on OLED screens. Use <code>#121212</code> or GitHub's <code>#0d1117</code> as your base.</p>
      `
        }
    ];

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-white selection:text-black relative">

            {/* MAIN LIST */}
            <div className="pt-24 pb-32 transition-transform duration-500 ease-in-out" style={{ transform: selectedPost ? 'scale(0.98) translateX(-5%) opacity-50' : 'none' }}>

                {/* Full width container but constrained max-width for readability */}
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

                    {/* HEADER */}
                    <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 pb-8 border-b border-[#30363d]">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-[#3fb950] rounded-full animate-pulse"></div>
                                <span className="font-mono text-xs text-[#3fb950] uppercase tracking-widest">System Logs</span>
                            </div>
                            {/* Fixed line-height here to prevent header overlap */}
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-tight">
                                TECH<br />LOGS.
                            </h1>
                        </div>
                        <div className="w-full md:w-auto relative group shrink-0">
                            <input type="text" placeholder="Search entries..." className="w-full md:w-80 bg-transparent border-b border-[#30363d] text-xl text-white px-0 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-[#30363d]" />
                            <Search size={20} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#30363d] group-focus-within:text-white transition-colors" />
                        </div>
                    </div>

                    {/* NO-IMAGE POST LIST */}
                    <div className="flex flex-col">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="group relative border-t border-[#30363d] py-16 md:py-24 cursor-pointer transition-colors duration-500 hover:bg-[#161b22]/30"
                                onClick={() => setSelectedPost(post)}
                            >
                                {/* Left Accent Bar on Hover */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-current transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" style={{ color: post.color }} />

                                <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-start pl-6">

                                    {/* Column 1: Index & Meta */}
                                    <div className="w-full md:w-32 flex flex-row md:flex-col justify-between md:justify-start gap-4 shrink-0">
                                        <span className="font-mono text-4xl md:text-6xl font-bold text-[#30363d] group-hover:text-white transition-colors duration-300 select-none">
                                            0{post.id}
                                        </span>
                                        <div className="flex flex-col text-xs font-mono text-[#8b949e] uppercase tracking-widest">
                                            <span>{post.date}</span>
                                            <span className="mt-1">{post.readTime}</span>
                                        </div>
                                    </div>

                                    {/* Column 2: Main Content */}
                                    <div className="flex-1 min-w-0"> {/* min-w-0 ensures flex child shrinks properly */}
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="text-xs font-mono text-[#8b949e] uppercase tracking-wider border border-[#30363d] px-2 py-1 rounded group-hover:border-white/20 group-hover:text-white transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Title - Fixed Line Height */}
                                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-[#8b949e] text-lg md:text-2xl font-light max-w-3xl leading-relaxed mb-8">
                                            {post.excerpt}
                                        </p>

                                        {/* Action */}
                                        <div className="flex items-center gap-3 text-white font-bold uppercase tracking-wider text-sm opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            Read Entry <ArrowUpRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* READER OVERLAY (Text Only Mode) */}
            <div className={`fixed inset-0 z-50 flex justify-end transition-visibility duration-500 ${selectedPost ? 'visible' : 'invisible'}`}>
                <div className={`absolute inset-0 bg-[#000000]/80 backdrop-blur-sm transition-opacity duration-500 ${selectedPost ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSelectedPost(null)} />

                <div className={`relative w-full max-w-4xl h-full bg-[#0d1117] border-l border-[#30363d] shadow-2xl overflow-y-auto transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${selectedPost ? 'translate-x-0' : 'translate-x-full'}`}>
                    {selectedPost && (
                        <>
                            {/* Reader Header */}
                            <div className="sticky top-0 z-20 flex justify-between items-center p-6 bg-[#0d1117]/95 backdrop-blur border-b border-[#30363d]">
                                <div className="flex items-center gap-2 text-[#8b949e] font-mono text-xs">
                                    <TerminalIcon size={14} /><span>~/logs/{selectedPost.id}</span>
                                </div>
                                <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-[#161b22] rounded-full transition-colors text-white group">
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            <div className="p-8 md:p-20">
                                {/* Title Block */}
                                <div className="mb-16 border-b border-[#30363d] pb-10">
                                    <div className="flex gap-2 mb-8">
                                        {selectedPost.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-xs font-mono uppercase tracking-wider rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
                                        {selectedPost.title}
                                    </h1>
                                    <div className="flex flex-col md:flex-row md:items-center gap-6 text-[#8b949e] font-mono text-sm uppercase tracking-widest border-l-2 border-[#30363d] pl-4">
                                        <span>{selectedPost.date}</span>
                                        <span className="hidden md:inline">/</span>
                                        <span>{selectedPost.readTime}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div
                                    className="prose prose-invert prose-lg max-w-none text-[#c9d1d9] font-light leading-loose selection:bg-white selection:text-black"
                                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                />

                                {/* Footer Navigation */}
                                <div className="mt-32 pt-10 border-t border-[#30363d] flex justify-between items-center">
                                    <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors group">
                                        <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
                                        <span className="font-mono uppercase text-sm tracking-wider">Return to Index</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;