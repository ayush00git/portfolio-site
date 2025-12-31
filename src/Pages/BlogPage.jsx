import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Calendar, Clock, Search, X, ChevronRight, Terminal as TerminalIcon, Hash } from 'lucide-react';

const BlogPage = () => {
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        document.body.style.overflow = selectedPost ? 'hidden' : 'unset';
    }, [selectedPost]);

    const [posts, setPosts] = useState([]);

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://tnc.ayushz.me/api/blog');
                const data = await response.json();
                const targetUserId = '6946e5bd9aaa7ef7e725117a';
                const sortPosts = (posts) => posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                if (Array.isArray(data)) {
                    const filtered = data.filter(post => post.user === targetUserId);
                    setPosts(sortPosts(filtered));
                } else if (data && Array.isArray(data.blogs)) {
                    const filtered = data.blogs.filter(post => post.user === targetUserId);
                    setPosts(sortPosts(filtered));
                } else {
                    setPosts([]);
                }
            } catch (error) {
                setPosts([]);
            }
        };

        fetchPosts();
    }, []);

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
                        {Array.isArray(posts) && posts.map((post, index) => (
                            <div
                                key={post._id || post.id || index}
                                className="group relative border-t border-[#30363d] py-16 md:py-24 cursor-pointer transition-colors duration-500 hover:bg-[#161b22]/30"
                                onClick={() => setSelectedPost(post)}
                            >
                                {/* Left Accent Bar on Hover */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-current transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" style={{ color: post.color }} />

                                <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-start pl-6">

                                    {/* Column 1: Index & Meta */}
                                    <div className="w-full md:w-32 flex flex-row md:flex-col justify-between md:justify-start gap-4 shrink-0">
                                        <span className="font-mono text-4xl md:text-6xl font-bold text-[#30363d] group-hover:text-white transition-colors duration-300 select-none">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                        <div className="flex flex-col text-xs font-mono text-[#8b949e] uppercase tracking-widest">
                                            <span>{formatDate(post.createdAt)}</span>
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
                                    <TerminalIcon size={14} /><span>~/logs/{(posts.indexOf(selectedPost) + 1).toString().padStart(2, '0')}</span>
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
                                        <span>{formatDate(selectedPost.createdAt)}</span>
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