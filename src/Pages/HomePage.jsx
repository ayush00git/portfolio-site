import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import Preloader from '../components/Preloader';

// Only run the intro once per tab, so moving between pages doesn't replay it
const seen = () => {
    try {
        return sessionStorage.getItem('introPlayed') === '1';
    } catch {
        return false;
    }
};

export default function HomePage() {
    const [ready, setReady] = useState(seen);

    const finish = () => {
        try {
            sessionStorage.setItem('introPlayed', '1');
        } catch {
            /* private mode — just don't remember it */
        }
        setReady(true);
    };

    return (
        <>
            {!ready && <Preloader onDone={finish} />}
            <HeroSection ready={ready} />
        </>
    );
}
