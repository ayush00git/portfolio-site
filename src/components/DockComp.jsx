import { useNavigate } from 'react-router-dom';
import { Home, Folder, Music, MessageCircle, Ghost } from 'lucide-react';
import Dock from './Dock';

const DockComp = () => {
    const navigate = useNavigate();

    const dockItems = [
        { icon: <Home size={24} color="white" strokeWidth={2.5} />, label: 'Home', onClick: () => navigate('/') },
        { icon: <Folder size={24} color="white" strokeWidth={2.5} />, label: 'Projects', onClick: () => navigate('/projects') },
        { icon: <Music size={24} color="white" strokeWidth={2.5} />, label: 'Spotify', onClick: () => navigate('/spotify') },
        { icon: <MessageCircle size={24} color="white" strokeWidth={2.5} />, label: 'Yaps', onClick: () => navigate('/yaps') },
        { icon: <Ghost size={24} color="white" strokeWidth={2.5} />, label: 'Random', onClick: () => navigate('/random') },
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
