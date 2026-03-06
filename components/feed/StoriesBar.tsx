'use client';

import { useState } from 'react';
import { StoryGroup } from '@/services/story';

const API_BASE = 'http://localhost:5000';

interface StoriesBarProps {
    stories: StoryGroup[];
    currentUserId: string;
}

import Link from 'next/link';

export default function StoriesBar({ stories, currentUserId }: StoriesBarProps) {
    const [active, setActive] = useState<StoryGroup | null>(null);
    const [storyIndex, setStoryIndex] = useState(0);

    const openStory = (group: StoryGroup, idx = 0) => {
        setActive(group);
        setStoryIndex(idx);
    };

    const closeStory = () => setActive(null);

    const nextStory = () => {
        if (!active) return;
        if (storyIndex < active.stories.length - 1) setStoryIndex(storyIndex + 1);
        else closeStory();
    };

    return (
        <>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {/* Add Story button */}
                <Link href="/feed/create-story" className="flex-shrink-0 flex flex-col items-center gap-1">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 transition-colors">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="text-xs text-gray-500">Your Story</span>
                </Link>

                {stories.map((group) => (
                    <button
                        key={group.author._id}
                        onClick={() => openStory(group)}
                        className="flex-shrink-0 flex flex-col items-center gap-1"
                    >
                        <div className={`w-16 h-16 rounded-full p-0.5 ${group.author._id === currentUserId ? 'bg-emerald-500' : 'bg-gradient-to-tr from-emerald-400 to-teal-400'}`}>
                            {group.author.image ? (
                                <img src={`${API_BASE}${group.author.image}`} alt={group.author.username} className="w-full h-full rounded-full object-cover border-2 border-white" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center border-2 border-white">
                                    <span className="text-emerald-700 font-bold text-lg">{group.author.username.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-gray-600 truncate max-w-[64px]">{group.author.username}</span>
                    </button>
                ))}

                {stories.length === 0 && (
                    <div className="flex items-center text-sm text-gray-400 ml-2">No friend stories yet</div>
                )}
            </div>

            {/* Story Viewer Modal */}
            {active && (
                <div className="fixed inset-0 z-50 bg-black" onClick={closeStory}>
                    <div className="relative h-[100dvh] w-screen overflow-hidden bg-black" onClick={(e) => e.stopPropagation()}>
                        {active.stories[storyIndex].mediaType === 'video' ? (
                            <video
                                src={`${API_BASE}${active.stories[storyIndex].mediaUrl}`}
                                className="h-full w-full bg-black object-contain"
                                autoPlay
                                playsInline
                                controls
                            />
                        ) : (
                            <img
                                src={`${API_BASE}${active.stories[storyIndex].mediaUrl}`}
                                alt="Story"
                                className="h-full w-full bg-black object-contain"
                            />
                        )}

                        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 to-transparent" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />

                        <div className="absolute left-0 right-0 top-0 p-3 sm:p-4">
                            <div className="mb-3 flex gap-1">
                                {active.stories.map((_, i) => (
                                    <div key={i} className={`h-1 flex-1 rounded-full ${i <= storyIndex ? 'bg-white' : 'bg-white/40'}`} />
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                {active.author.image ? (
                                    <img src={`${API_BASE}${active.author.image}`} alt="" className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-200 text-sm font-bold text-emerald-800">
                                        {active.author.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-white">{active.author.username}</span>
                            </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3 sm:px-4">
                            <button
                                onClick={() => setStoryIndex(Math.max(0, storyIndex - 1))}
                                disabled={storyIndex === 0}
                                className="rounded-xl bg-black/35 px-4 py-2 text-white/85 transition-colors hover:bg-black/50 hover:text-white disabled:cursor-not-allowed disabled:text-white/40"
                            >
                                {'<'} Prev
                            </button>
                            <button
                                onClick={nextStory}
                                className="rounded-xl bg-black/35 px-4 py-2 text-white/85 transition-colors hover:bg-black/50 hover:text-white"
                            >
                                {storyIndex === active.stories.length - 1 ? 'Close' : 'Next >'}
                            </button>
                        </div>

                        <button onClick={closeStory} className="absolute right-3 top-2 text-white text-2xl leading-none sm:right-4 sm:top-3">&times;</button>
                    </div>
                </div>
            )}
        </>
    );
}
