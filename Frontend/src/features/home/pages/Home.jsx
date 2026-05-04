import React, { useState } from 'react';
import FaceExpression from '../../Expression/components/FaceExpression';
import Player from '../components/Player';
import { useSong } from '../hooks/useSong';
import { useAuth } from '../../auth/hooks/useAuth';

const Home = () => {
    const { handleGetSong } = useSong();
    const { user, handleLogout } = useAuth();
    const [currentMood, setCurrentMood] = useState('Neutral');

    const getEmoji = (mood) => {
        if (mood === 'Happy') return '😊';
        if (mood === 'Sad') return '😢';
        if (mood === 'Angry') return '😠';
        if (mood === 'Surprised') return '😲';
        return '😐';
    };

    return (
        <div className="dashboard-layout">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                    <h2>Moodify</h2>
                </div>
                <div className="nav-user">
                    <span>{user?.username || 'Guest'}</span>
                    <button className="btn-logout" onClick={handleLogout}>logout</button>
                    <div className="avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                </div>
            </nav>

            <main className="dashboard-content">
                {/* LEFT PANEL - Mood Scanner */}
                <div className="left-panel">
                    <FaceExpression
                        onClick={(expression) => { 
                            setCurrentMood(expression);
                            if (expression !== 'Neutral') {
                                handleGetSong({ mood: expression.toLowerCase() });
                            }
                        }}
                    />
                </div>

                {/* RIGHT PANEL - Results & Playback */}
                <div className="main-panel">
                    {/* Mood Analysis Card */}
                    <div className="mood-analysis-card">
                        <div className="mood-analysis-info">
                            <h3>CURRENT MOOD ANALYSIS</h3>
                            <h1>{currentMood}</h1>
                            <div className="match-bar-container">
                                <div className="match-bar">
                                    <div className="match-bar-fill"></div>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#00ffff' }}>99% match</span>
                            </div>
                        </div>
                        <div className="mood-emoji-large">{getEmoji(currentMood)}</div>
                    </div>

                    {/* Player Component */}
                    <Player />
                </div>
            </main>
        </div>
    );
};

export default Home;