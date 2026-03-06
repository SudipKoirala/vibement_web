'use client';

import { useEffect } from 'react';

interface ImageLightboxProps {
    url: string;
    onClose: () => void;
}

export default function ImageLightbox({ url, onClose }: ImageLightboxProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <img
                src={url}
                alt="Full screen"
                className="max-h-screen max-w-full object-contain select-none"
                style={{ maxHeight: '95vh', maxWidth: '95vw' }}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}
