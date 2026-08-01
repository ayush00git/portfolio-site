// Shared across every projects-page experiment so they compare like for like.
export const projects = [
  {
    title: 'Apache Fory',
    category: 'Open Source / Serialization',
    description:
      'A blazingly fast multi-language serialization framework, used in production by Alibaba, Ant Group, ByteDance and Warner Bros. I am a committer — I built the gRPC-Go stub codegen with a custom ForyCodec for zero-copy marshalling, added IEEE 754 float16 across the Go and JavaScript runtimes, and shipped payload size guardrails that reject oversized untrusted input before deserialization.',
    githubLink: 'https://github.com/apache/fory',
    liveLink: 'https://fory.apache.org',
  },
  {
    title: 'cms-web',
    category: 'Backend / Web',
    description:
      'The complaint management system for the Estate Office of NIT Hamirpur. Multi-stage approval workflow across civil/electrical and official/residential categories, role-based routing for XEN, JE and AE officers, and goroutine-driven email notifications at every stage.',
    githubLink: 'https://github.com/ayush00git/cms-web',
    liveLink: '#',
  },
  {
    title: 'laca-web',
    category: 'APIs / Web',
    description:
      "NITH's official LA/CA course registration portal. Handled 70k+ requests across a 2-day window, with a Redis and BullMQ backed job queue keeping SMTP off the request path and MongoDB atomic operations preventing race conditions on concurrent seat enrollment.",
    githubLink: 'https://github.com/ayush00git/laca-web',
    liveLink: 'https://laca.nith.ac.in',
  },
  {
    title: 'Stanza',
    category: 'AI / Computational Bio',
    description:
      'A structure-based, resistance-aware pipeline that designs and screens small molecules against covalent and steric resistance mutations, orchestrating Claude in a closed loop of molecule generation and docking against wild-type and mutant protein structures.',
    githubLink: 'https://github.com/ayush00git/stanza',
    liveLink: 'https://www.youtube.com/watch?v=o6uQK9lP_V4',
  },
  {
    title: 'THE NERDS COMMUNITY',
    category: 'FullStack / Web',
    description:
      'A real-time chat application designed for tech enthusiasts to connect, discuss, and collaborate in dedicated rooms. A community that actually ships.',
    githubLink: 'https://github.com/ayush00git/TNC',
    liveLink: 'https://tnc.ayushz.me',
  },
  {
    title: 'goth',
    category: 'Backend / Microservices',
    description: 'A production grade Go authentication microservice.',
    githubLink: 'https://github.com/ayush00git/goth',
    liveLink: '#',
  },
  {
    title: 'cortex',
    category: 'AI / MCP',
    description:
      'An MCP server that gives your AI agent long-term memory over your GitHub. Ask it once about any public repo — or a private one of yours — and it never forgets.',
    githubLink: 'https://github.com/ayush00git/cortex',
    liveLink: '#',
  },
  {
    title: 'DezNov',
    category: 'Design / Web (In development)',
    description:
      'A platform where you can share your coding and design projects within the community, would help users to get inspos and connect within a community and a much more...',
    githubLink: 'https://github.com/ayush00git/DezNov',
    liveLink: '#',
  },
];

export const vibeProjects = [
  {
    title: 'AppTeam site',
    category: 'Creative / Web',
    description:
      'The official website of AppTeam, a core club of NITH, showcasing the team, its events and its projects. Handled over 50k+ requests during the freshmen interviews and workshops.',
    githubLink: 'https://github.com/ayush00git/AppTeam-official-website',
    liveLink: 'https://appteam.nith.ac.in',
  },
  {
    title: 'TNC MOBILE',
    category: 'Mobile / React Native',
    description:
      'The mobile companion for The Nerds Community. Real-time chat with push notifications, seamless room navigation, and native mobile experience for tech enthusiasts on the go.',
    githubLink: 'https://github.com/ayush00git/TNC',
    liveLink: 'https://github.com/ayush00git/TNC/releases/tag/v1.0.0',
  },
  {
    title: 'vicy',
    category: 'Tooling / Local',
    description:
      'Voice to text anywhere on my machine. Built because I was tired of typing prompts to Claude Code.',
    githubLink: 'https://github.com/ayush00git/vicy',
    liveLink: '#',
  },
  {
    title: 'MY PORTFOLIO',
    category: 'Creative / Web',
    description:
      "The website you're currently browsing. Horizontal scroll driven by GSAP, smooth scrolling through Lenis, and a lot of type.",
    githubLink: 'https://github.com/ayush00git/portfolio-site',
    liveLink: 'https://www.ayushz.me',
  },
  {
    title: 'PARKKARO SITE',
    category: 'Landing / Web',
    description:
      "A sleek landing page for ParkKaro, a smart parking solution app. Clean design, responsive layout, and optimized for conversions to showcase the app's features and drive downloads.",
    githubLink: 'https://github.com/ayush00git/parkkaro-site',
    liveLink: 'https://park-karo-site.vercel.app/',
  },
  {
    title: 'CLI PORTFOLIO',
    category: 'Terminal / Interactive',
    description:
      'A terminal-style portfolio for the command-line enthusiasts. Navigate through my work using terminal commands, complete with ASCII art and retro aesthetics.',
    githubLink: 'https://github.com/ayush00git/portfolio',
    liveLink: 'https://cli.ayushz.me',
  },
];

export const skillGroups = [
  { id: '01', label: 'Languages', items: ['GO', 'C/C++', 'TYPESCRIPT', 'JAVASCRIPT', 'PYTHON'] },
  {
    id: '02',
    label: 'Backend',
    items: ['GIN', 'NET/HTTP', 'GRPC', 'NODE.JS', 'EXPRESS', 'REST', 'WEBSOCKETS', 'MICROSERVICES'],
  },
  { id: '03', label: 'AI & LLM', items: ['MCP', 'RAG'] },
  {
    id: '04',
    label: 'Databases & Infra',
    items: ['POSTGRESQL', 'MONGODB', 'REDIS', 'GORM', 'AWS', 'NGINX', 'DOCKER', 'LINUX'],
  },
  {
    id: '05',
    label: 'Serialization & Tools',
    items: ['PROTOBUF', 'FORY FDL', 'COBRA', 'VIPER', 'GIT', 'POSTMAN'],
  },
];
