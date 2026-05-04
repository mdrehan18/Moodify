import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";


export default function FaceExpression({ onClick = () => { } }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [ expression, setExpression ] = useState("Detecting...");

    useEffect(() => {
        init({ landmarkerRef, videoRef, streamRef });

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    async function handleClick() {
        const expression = detect({ landmarkerRef, videoRef, setExpression })
        console.log(expression)
        onClick(expression)
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1.5rem', background: 'rgba(20, 25, 40, 0.4)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '0.65rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#00ffff', marginBottom: '0.5rem' }}>MOODIFY SCANNER</h4>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Expression Capture</h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Look into the camera to detect your mood</p>
            </div>
            
            {/* Webcam Feed */}
            <div style={{
                position: 'relative',
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                border: '1px solid rgba(0, 255, 255, 0.2)',
                background: '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: '4/3'
            }}>
                <video
                    ref={videoRef}
                    style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    playsInline
                />
            </div>
            
            <button 
                onClick={handleClick}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'linear-gradient(90deg, #00ffff, #3b82f6)',
                    color: '#0b0f19',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)',
                    transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
                Detect Mood
            </button>
        </div>
    );
}