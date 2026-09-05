export interface Project {
  title: string
  category: string
  description: string
  githubLink: string
  liveLink: string
}

export const projects: Project[] = [
  {
    title: 'Apache Fory',
    category: 'Open Source / Serialization',
    description:
      'A blazingly fast multi-language serialization framework, used in production by Alibaba, Ant Group, ByteDance and Warner Bros. I am a committer. I built the gRPC-Go stub codegen with a custom ForyCodec for zero-copy marshalling, added IEEE 754 float16 across the Go and JavaScript runtimes, and shipped payload size guardrails that reject oversized untrusted input before deserialization.',
    githubLink: 'https://github.com/apache/fory',
    liveLink: 'https://fory.apache.org',
  },
  {
    title: 'cms-web',
    category: 'Backend / Web',
    description:
      'The complaint management system for the Estate Office of NIT Hamirpur. Multi-stage approval workflow across civil/electrical and official/residential categories, role-based routing for XEN, JE and AE officers, and goroutine-driven email notifications at every stage.',
    githubLink: 'https://github.com/ayush00git/cms-web',
    liveLink: 'https://cms.nith.ac.in',
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
    title: 'ProtPocket',
    category: 'AI / Computational Bio',
    description:
      'A browser-native computational drug discovery platform built on AlphaFold data, with pocket detection, docking and mutation impact prediction.',
    githubLink: 'https://github.com/ayush00git/ProtPocket',
    liveLink: '#',
  },
  {
    title: 'goth',
    category: 'Backend / Microservices',
    description: 'A production grade Go authentication microservice. Currently implementing Raft consensus for token revocation across instances.',
    githubLink: 'https://github.com/ayush00git/goth',
    liveLink: '#',
  },
  {
    title: 'gothctl',
    category: 'CLI / Tools',
    description: 'A CLI built with Cobra and Viper to manage the goth microservice.',
    githubLink: 'https://github.com/ayush00git/gothctl',
    liveLink: '#',
  },
  {
    title: 'The Nerds Community',
    category: 'FullStack / Web',
    description:
      'A real-time chat application designed for tech enthusiasts to connect, discuss, and collaborate in dedicated rooms. A community that actually ships.',
    githubLink: 'https://github.com/ayush00git/TNC',
    liveLink: 'https://tnc.ayushz.me',
  },
  {
    title: 'AppTeam site',
    category: 'Creative / Web',
    description:
      'The official website of AppTeam, a core club of NITH, showcasing the team, its events and its projects. Handled over 50k+ requests during the freshmen interviews and workshops.',
    githubLink: 'https://github.com/ayush00git/appteam-web',
    liveLink: 'https://appteam.nith.ac.in',
  },
  {
    title: 'DezNov',
    category: 'Design / Web (In development)',
    description:
      'A platform where you can share your coding and design projects within the community, get inspiration and connect with like-minded people.',
    githubLink: 'https://github.com/ayush00git/DezNov',
    liveLink: '#',
  },
]

export const hobbyProjects: Project[] = [
  {
    title: 'wisp',
    category: 'Security Research / Linux',
    description:
      'The most silent, lightweight resident of the kernel. Gives your system AI intelligence from the kernel level. Linux only, not open source, waitlist open.',
    githubLink: '#',
    liveLink: 'https://wisp.ayyush.dev',
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
    title: 'cortex',
    category: 'AI / MCP',
    description:
      'An MCP server that gives your AI agent long-term memory over your GitHub. Ask it once about any public repo, or a private one of yours, and it never forgets.',
    githubLink: 'https://github.com/ayush00git/cortex',
    liveLink: '#',
  },
  {
    title: 'cbot',
    category: 'CLI / AI',
    description:
      "An AI assistant in your terminal, for people who don't want to leave it to get answers.",
    githubLink: 'https://github.com/ayush00git/cbot',
    liveLink: '#',
  },
  {
    title: 'lowkey',
    category: 'P2P / Chat',
    description: 'A peer-to-peer, end-to-end encrypted chat. Chat once, leave no digital footprint.',
    githubLink: 'https://github.com/ayush00git/lowkey',
    liveLink: '#',
  },
  {
    title: 'gh-widget',
    category: 'Android / Widget',
    description: 'A custom GitHub contributions chart widget for Android, but the cool way.',
    githubLink: 'https://github.com/ayush00git/gh-widget',
    liveLink: '#',
  },
  {
    title: 'TNC Mobile',
    category: 'Mobile / React Native',
    description:
      'The mobile companion for The Nerds Community. Real-time chat with push notifications and a native mobile experience.',
    githubLink: 'https://github.com/ayush00git/TNC',
    liveLink: 'https://github.com/ayush00git/TNC/releases/tag/v1.0.0',
  },
  {
    title: 'My Portfolio',
    category: 'Creative / Web',
    description: "The website you're currently browsing. Next.js, a dock, and not much else.",
    githubLink: 'https://github.com/ayush00git/portfolio-site',
    liveLink: 'https://ayyush.dev',
  },
]

export const skillGroups = [
  { id: '01', label: 'Languages', items: ['GO', 'C/C++', 'TYPESCRIPT', 'JAVASCRIPT', 'PYTHON'] },
  { id: '02', label: 'Backend', items: ['GIN', 'NET/HTTP', 'GRPC', 'NODE.JS', 'EXPRESS', 'REST', 'WEBSOCKETS', 'MICROSERVICES'] },
  { id: '03', label: 'AI & LLM', items: ['MCP', 'RAG', 'AGENTS'] },
  { id: '04', label: 'Databases & Infra', items: ['POSTGRESQL', 'MONGODB', 'REDIS', 'GORM', 'AWS', 'NGINX', 'DOCKER', 'LINUX'] },
  { id: '05', label: 'Serialization & Tools', items: ['PROTOBUF', 'FORY FDL', 'COBRA', 'VIPER', 'GIT', 'POSTMAN'] },
]
