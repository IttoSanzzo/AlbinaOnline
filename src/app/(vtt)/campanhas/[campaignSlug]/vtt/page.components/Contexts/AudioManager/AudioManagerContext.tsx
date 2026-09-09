"use client";

import { createContext, ReactNode, useContext, useRef } from "react";

import { AudioManager } from "./index";
import {
	AudioCategory,
	AudioHandle,
	AudioPlayOptions,
	AudioSourceId,
} from "./types";

interface AudioManagerContextValue {
	manager: AudioManager;

	play: (options: AudioPlayOptions) => Promise<AudioHandle | undefined>;

	preload: (path: string) => HTMLAudioElement | undefined;
	unload: (path: string) => void;

	stop: (id: string) => void;
	stopAll: () => void;

	pause: (id: string) => void;
	pauseAll: () => void;

	resume: (id: string) => void;
	resumeAll: () => void;

	getEffectiveVolume: (
		type?: AudioCategory,
		sourceId?: AudioSourceId,
		localVolume?: number,
	) => number;

	getGlobalVolume: () => number;
	setGlobalVolume: (volume: number) => void;

	getCategoryVolume: (type: AudioCategory) => number;
	setCategoryVolume: (type: AudioCategory, volume: number) => void;
	resetCategoryVolume: (type: AudioCategory) => void;

	getSourceVolume: (type: AudioCategory, sourceId: AudioSourceId) => number;
	setSourceVolume: (
		type: AudioCategory,
		sourceId: AudioSourceId,
		volume: number,
	) => void;
	resetSourceVolume: (type: AudioCategory, sourceId: AudioSourceId) => void;

	isMuted: () => boolean;
	setMuted: (muted: boolean) => void;
	toggleMuted: () => boolean;
}

const AudioManagerContext = createContext<AudioManagerContextValue | null>(
	null,
);

export interface AudioManagerProviderProps {
	children: ReactNode;
}

export function AudioManagerProvider({ children }: AudioManagerProviderProps) {
	const managerRef = useRef<AudioManager | null>(null);
	if (!managerRef.current) managerRef.current = new AudioManager();
	const manager = managerRef.current;

	const value: AudioManagerContextValue = {
		manager,
		play: manager.play.bind(manager),
		preload: manager.preload.bind(manager),
		unload: manager.unload.bind(manager),
		stop: manager.stop.bind(manager),
		stopAll: manager.stopAll.bind(manager),
		pause: manager.pause.bind(manager),
		pauseAll: manager.pauseAll.bind(manager),
		resume: manager.resume.bind(manager),
		resumeAll: manager.resumeAll.bind(manager),
		getEffectiveVolume: manager.getEffectiveVolume.bind(manager),
		getGlobalVolume: manager.getGlobalVolume.bind(manager),
		setGlobalVolume: manager.setGlobalVolume.bind(manager),
		getCategoryVolume: manager.getCategoryVolume.bind(manager),
		setCategoryVolume: manager.setCategoryVolume.bind(manager),
		resetCategoryVolume: manager.resetCategoryVolume.bind(manager),
		getSourceVolume: manager.getSourceVolume.bind(manager),
		setSourceVolume: manager.setSourceVolume.bind(manager),
		resetSourceVolume: manager.resetSourceVolume.bind(manager),
		isMuted: manager.isMuted.bind(manager),
		setMuted: manager.setMuted.bind(manager),
		toggleMuted: manager.toggleMuted.bind(manager),
	};

	return (
		<AudioManagerContext.Provider value={value}>
			{children}
		</AudioManagerContext.Provider>
	);
}

export function useAudioManager(): AudioManagerContextValue {
	const context = useContext(AudioManagerContext);
	if (!context)
		throw new Error(
			"useAudioManager must be used inside an AudioManagerProvider.",
		);
	return context;
}
