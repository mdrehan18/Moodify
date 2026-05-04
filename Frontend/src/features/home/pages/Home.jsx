import React, { useState } from 'react';
import FaceExpression from '../../Expression/components/FaceExpression';
import Player from '../components/Player';
import { useSong } from '../hooks/useSong';
import { useAuth } from '../../auth/hooks/useAuth';

const Home = () => {
    const { handleGetSong, loading: songLoading } = useSong();
    const { user, handleLogout } = useAuth();
    const [currentMood, setCurrentMood] = useState('Neutral');
    const [isDetecting, setIsDetecting] = useState(false);

    const getEmoji = (mood) => {
        if (mood === 'Happy') return '😄';
        if (mood === 'Sad') return '😢';
        if (mood === 'Angry') return '😠';
        if (mood === 'Surprised') return '😲';
        return '😐';
    };

    const getMoodMessage = (mood) => {
        if (mood === 'Happy') return "You look happy today! Keep the vibe going 🚀";
        if (mood === 'Sad') return "It's okay to feel sad. Let this song hug you 🫂";
        if (mood === 'Surprised') return "Whoa! Surprised? Let's hype it up ⚡";
        return "Show a strong emotion to play a song...";
    };

    const handleTryAnother = () => {
        if (currentMood !== 'Neutral') {
            handleGetSong({ mood: currentMood.toLowerCase() });
        }
    };

    return (
        <div className="dashboard-layout">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                    <h2>Moodify</h2>
                </div>
                <div className="nav-user">
                    <span>{user?.username || 'Guest'}</span>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
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

                {/* RIGHT PANEL - Results */}
                <div className="main-panel">
                    {/* Mood Analysis Card */}
                    <div className="mood-analysis-card">
                        <div className="mood-analysis-info">
                            <h3>VIBE CHECK</h3>
                            {songLoading ? (
                                <div className="skeleton" style={{ width: '200px', height: '4rem', marginBottom: '0.5rem' }}></div>
                            ) : (
                                <h1>{currentMood}</h1>
                            )}
                            
                            <p>{songLoading ? "Finding the perfect track..." : getMoodMessage(currentMood)}</p>
                            
                            {currentMood !== 'Neutral' && !songLoading && (
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button 
                                        onClick={() => {
                                            const audio = document.querySelector('audio');
                                            if (audio) {
                                                audio.play();
                                            }
                                        }} 
                                        className="btn-primary"
                                        disabled={songLoading}
                                    >
                                        Play Song
                                    </button>
                                    <button 
                                        onClick={handleTryAnother} 
                                        className="btn-secondary"
                                        disabled={songLoading}
                                    >
                                        Try another song
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mood-emoji-large" style={{ transition: 'all 0.3s ease', opacity: songLoading ? 0.5 : 1 }}>
                            {getEmoji(currentMood)}
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Player */}
            <Player />
        </div>
    );
};

export default Home;