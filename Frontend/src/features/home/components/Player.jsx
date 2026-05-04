import React, { useRef, useState, useEffect, useContext } from 'react'
import { SongContext } from '../song.context'
import { useSong } from '../hooks/useSong'
import './player.scss'

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

const Player = () => {
    const { song } = useSong()

    const audioRef = useRef(null)
    const progressRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [speed, setSpeed] = useState(1)
    const [volume, setVolume] = useState(1)
    const [showSpeed, setShowSpeed] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    // Reset player when song changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load()
            setIsPlaying(false)
            setCurrentTime(0)
        }
    }, [song?.url])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    const skip = (secs) => {
        const audio = audioRef.current
        if (!audio) return
        audio.currentTime = Math.min(Math.max(audio.currentTime + secs, 0), duration)
    }

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime)
    }

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration)
    }

    const handleProgressClick = (e) => {
        const bar = progressRef.current
        const rect = bar.getBoundingClientRect()
        const ratio = (e.clientX - rect.left) / rect.width
        const newTime = ratio * duration
        audioRef.current.currentTime = newTime
        setCurrentTime(newTime)
    }

    const handleSpeedChange = (s) => {
        setSpeed(s)
        audioRef.current.playbackRate = s
        setShowSpeed(false)
    }

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value)
        setVolume(val)
        audioRef.current.volume = val
        setIsMuted(val === 0)
    }

    const toggleMute = () => {
        const audio = audioRef.current
        if (isMuted) {
            audio.volume = volume || 0.5
            setIsMuted(false)
        } else {
            audio.volume = 0
            setIsMuted(true)
        }
    }

    const handleSongEnd = () => {
        setIsPlaying(false)
        setCurrentTime(0)
    }

    const progress = duration ? (currentTime / duration) * 100 : 0

    if (!song) {
        return (
            <div className="player">
                <div className="player__top">
                    <div className="player__info">
                        <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                        </div>
                        <div className="player__meta">
                            <span className="player__mood">Waiting...</span>
                            <p className="player__title" style={{ color: 'rgba(255,255,255,0.5)' }}>No song found</p>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Show a strong emotion (Happy, Sad, Surprised) to play!</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="player">
            <audio
                ref={audioRef}
                src={song.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleSongEnd}
            />

            <div className="player__top">
                {/* Poster + Info */}
                <div className="player__info">
                    <img
                        className="player__poster"
                        src={song.posterUrl || "https://i.scdn.co/image/ab67616d00004851c243f7ed33c301e74f358fa6"}
                        alt={song.title}
                    />
                    <div className="player__meta">
                        <span className="player__mood">{song.mood || "nutural"}</span>
                        <p className="player__title">{song.title || "Marco Teaser Theme"}</p>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{song.artist || "Ravi Basrur"}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="player__controls">
                    {/* Backward 5s */}
                    <button className="player__btn player__btn--skip" onClick={() => skip(-5)} title="Back 5s">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <path d="M1 4v6h6"/>
                            <path d="M3.51 15a9 9 0 1 0 .49-3.6"/>
                        </svg>
                    </button>

                    {/* Play / Pause */}
                    <button className="player__btn player__btn--play" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                <rect x="6" y="4" width="4" height="16" rx="1"/>
                                <rect x="14" y="4" width="4" height="16" rx="1"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                <path d="M8 5.14v14l11-7-11-7z"/>
                            </svg>
                        )}
                    </button>

                    {/* Forward 5s */}
                    <button className="player__btn player__btn--skip" onClick={() => skip(5)} title="Forward 5s">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <path d="M23 4v6h-6"/>
                            <path d="M20.49 15a9 9 0 1 1-.49-3.6"/>
                        </svg>
                    </button>

                    {/* Volume */}
                    <div className="player__volume">
                        <button className="player__btn player__btn--vol" onClick={toggleMute} title="Mute">
                            {isMuted || volume === 0 ? (
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.87 8.87 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18L19 19.27 20.27 18 5.27 3 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="player__progress-wrap">
                <span className="player__time">{formatTime(currentTime)}</span>
                <div
                    className="player__progress"
                    ref={progressRef}
                    onClick={handleProgressClick}
                >
                    <div className="player__progress-fill" style={{ width: `${progress}%` }} />
                    <div className="player__progress-thumb" style={{ left: `${progress}%` }} />
                </div>
                <span className="player__time">{formatTime(duration)}</span>
            </div>
        </div>
    )
}

export default Player