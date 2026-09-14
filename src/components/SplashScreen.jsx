import { useState, useEffect } from 'react';
import '../styles/splash.css';

export default function SplashScreen({ onFinish }) {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Progress animatsiya
        const duration = 2000; // 2 sekund
        const interval = 30;
        const increment = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    // 100% bo'lganda fade-out va tugatish
    useEffect(() => {
        if (progress >= 100) {
            setFadeOut(true);
            const timer = setTimeout(() => {
                onFinish();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [progress, onFinish]);

    return (
        <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
            {/* Fon shakllari */}
            <div className="splash-bg-shapes">
                <div className="splash-shape splash-shape-1"></div>
                <div className="splash-shape splash-shape-2"></div>
                <div className="splash-shape splash-shape-3"></div>
            </div>

            {/* Yulduzlar */}
            <div className="splash-stars">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="splash-star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Kontent */}
            <div className="splash-content">
                <div className="splash-logo">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1024 1192"
                        width="180"
                        height="210"
                        className="splash-logo-svg"
                    >
                        <defs>
                            <radialGradient id="splashBgGrad" cx="50%" cy="40%" r="70%">
                                <stop offset="0%" stopColor="#2a3a44" />
                                <stop offset="50%" stopColor="#1a2830" />
                                <stop offset="100%" stopColor="#0d1418" />
                            </radialGradient>
                            <linearGradient id="splashZGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#5ac5cc" />
                                <stop offset="40%" stopColor="#3aa8c4" />
                                <stop offset="100%" stopColor="#1e6a9e" />
                            </linearGradient>
                            <linearGradient id="splashWaveTop" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#2a5a6a" />
                                <stop offset="50%" stopColor="#4a9aae" />
                                <stop offset="100%" stopColor="#5ac5d4" />
                            </linearGradient>
                            <linearGradient id="splashWaveBottom" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#5ac5d4" />
                                <stop offset="50%" stopColor="#3a95b8" />
                                <stop offset="100%" stopColor="#1a4a6a" />
                            </linearGradient>
                            <linearGradient id="splashCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#2a4a5a" />
                                <stop offset="50%" stopColor="#1a3a4a" />
                                <stop offset="100%" stopColor="#0d2530" />
                            </linearGradient>
                            <linearGradient id="splashTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#e8f4f8" />
                                <stop offset="100%" stopColor="#a8c8d8" />
                            </linearGradient>
                            <filter id="splashGlow">
                                <feGaussianBlur stdDeviation="8" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <circle
                            cx="512"
                            cy="500"
                            r="340"
                            fill="none"
                            stroke="url(#splashCircleGrad)"
                            strokeWidth="35"
                            opacity="0.7"
                        />

                        <g filter="url(#splashGlow)">
                            <path
                                d="M 270 230 Q 400 190, 510 235 Q 640 285, 760 235 Q 780 225, 765 260 Q 640 315, 510 260 Q 400 215, 270 250 Q 255 255, 265 245 Z"
                                fill="url(#splashWaveTop)"
                            />
                        </g>

                        <g filter="url(#splashGlow)">
                            <path
                                d="M 720 230 Q 620 400, 480 550 Q 380 660, 280 780 Q 270 800, 290 795 Q 400 680, 520 555 Q 640 430, 730 265 Q 735 250, 720 230 Z"
                                fill="url(#splashZGrad)"
                            />
                        </g>

                        <g filter="url(#splashGlow)">
                            <path
                                d="M 270 730 Q 400 690, 510 730 Q 640 780, 760 730 Q 780 720, 765 755 Q 640 810, 510 755 Q 400 710, 270 745 Q 255 750, 265 740 Z"
                                fill="url(#splashWaveBottom)"
                            />
                        </g>

                        <text
                            x="512"
                            y="1100"
                            fontFamily="Arial, sans-serif"
                            fontSize="200"
                            fontWeight="300"
                            fill="url(#splashTextGrad)"
                            textAnchor="middle"
                            letterSpacing="8"
                        >
                            zenzo
                        </text>
                    </svg>
                </div>

                <h1 className="splash-title">
                    Zenzo <span>Market</span>
                </h1>
                <p className="splash-subtitle">Fermerlardan to'g'ridan-to'g'ri</p>

                <div className="splash-progress">
                    <div
                        className="splash-progress-bar"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="splash-progress-text">
                    Yuklanmoqda... {Math.round(progress)}%
                </div>
            </div>

            <div className="splash-footer">
                <p>🌾 O'zbekistonda ishlab chiqarilgan</p>
            </div>
        </div>
    );
}