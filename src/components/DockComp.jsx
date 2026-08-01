import { useNavigate } from 'react-router-dom';
import { Home, Folder, Trophy, FileText, Github, Linkedin, Instagram } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import Dock from './Dock';

const RESUME =
    'https://drive.google.com/file/d/1hocYWUEIPINgFh6mUfeMImRo1ork7KJz/view?usp=sharing';

// TODO: swap in Ayush's actual X handle — no handle exists anywhere in the repo
const X_URL = 'https://x.com/';

const openIn = (url) => () => window.open(url, '_blank', 'noopener,noreferrer');

const DockComp = () => {
    const navigate = useNavigate();

    const dockItems = [
        { icon: <Home size={22} color="white" strokeWidth={2.2} />, label: 'Home', onClick: () => navigate('/') },
        { icon: <Folder size={22} color="white" strokeWidth={2.2} />, label: 'Projects', onClick: () => navigate('/projects') },
        { icon: <Trophy size={22} color="white" strokeWidth={2.2} />, label: 'Achievements', onClick: () => navigate('/achievements') },
        { icon: <FileText size={22} color="white" strokeWidth={2.2} />, label: 'Resume', onClick: openIn(RESUME) },
        { icon: <Github size={22} color="white" strokeWidth={2.2} />, label: 'GitHub', onClick: openIn('https://github.com/ayush00git') },
        { icon: <Linkedin size={22} color="white" strokeWidth={2.2} />, label: 'LinkedIn', onClick: openIn('https://www.linkedin.com/in/ayush-kumar-368446246/') },
        { icon: <FaXTwitter size={20} color="white" />, label: 'X', onClick: openIn(X_URL) },
        { icon: <Instagram size={22} color="white" strokeWidth={2.2} />, label: 'Instagram', onClick: openIn('https://www.instagram.com/ayyush_z/') },
    ];

    return (
        <Dock
            items={dockItems}
            panelHeight={64}
            baseItemSize={44}
            magnification={78}
        />
    );
};

export default DockComp;
