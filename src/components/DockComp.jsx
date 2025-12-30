import { useNavigate } from 'react-router-dom';
import { Home, Folder, BookOpen, MessageCircle, Trophy } from 'lucide-react';
import Dock from './Dock';

const DockComp = () => {
    const navigate = useNavigate();

    const dockItems = [
        { icon: <Home size={24} color="white" strokeWidth={2.5} />, label: 'Home', onClick: () => navigate('/') },
        { icon: <Folder size={24} color="white" strokeWidth={2.5} />, label: 'Projects', onClick: () => navigate('/projects') },
        { icon: <BookOpen size={24} color="white" strokeWidth={2.5} />, label: 'Blogs', onClick: () => navigate('/blogs') },
        { icon: <MessageCircle size={24} color="white" strokeWidth={2.5} />, label: 'Yaps', onClick: () => navigate('/yaps') },
        { icon: <Trophy size={24} color="white" strokeWidth={2.5} />, label: 'Achievements', onClick: () => navigate('/achievements') },
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
