import { useNavigate } from 'react-router-dom';
import { Home, Folder, BookOpen, MessageCircle, Trophy, FileText } from 'lucide-react';
import Dock from './Dock';

const DockComp = () => {
    const navigate = useNavigate();

    const dockItems = [
        { icon: <Home size={24} color="white" strokeWidth={2.5} />, label: 'Home', onClick: () => navigate('/') },
        { icon: <Folder size={24} color="white" strokeWidth={2.5} />, label: 'Projects', onClick: () => navigate('/projects') },
        { icon: <BookOpen size={24} color="white" strokeWidth={2.5} />, label: 'Blogs', onClick: () => navigate('/blogs') },
        { icon: <Trophy size={24} color="white" strokeWidth={2.5} />, label: 'Achievements', onClick: () => navigate('/achievements') },
        { icon: <FileText size={24} color="white" strokeWidth={2.5} />, label: 'Resume', onClick: () => window.open('https://drive.google.com/file/d/1ygBlfWW2AL3rd8YXxCXrQWABzklvgMDb/view?usp=sharing', '_blank') },
    ];

    return (
        <Dock
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={100}
        />
    );
};

export default DockComp;
