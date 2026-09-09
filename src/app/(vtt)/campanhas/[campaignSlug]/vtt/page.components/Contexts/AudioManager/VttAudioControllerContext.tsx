"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
} from "react";
import { Guid } from "@/libs/stp@types";
import { useAudioManager } from "../AudioManager/AudioManagerContext";
import { AudioHandle, AudioPlayOptions } from "../AudioManager/types";
import { useVttLocalSettings } from "../VttLocalSettings/VttLocalSettingsProvider";
interface VttAudioControllerContextValue {
	play: (options: AudioPlayOptions) => Promise<AudioHandle | undefined>;
}

const VttAudioControllerContext =
	createContext<VttAudioControllerContextValue | null>(null);

interface VttAudioControllerProviderProps {
	children: ReactNode;
}

export function VttAudioControllerProvider({
	children,
}: VttAudioControllerProviderProps) {
	const { play: playAudio } = useAudioManager();
	const { settings, getUserAudioSettings } = useVttLocalSettings();

	const getVolumeMultiplier = useCallback(
		(options: AudioPlayOptions) => {
			let volume = settings.audio.masterVolume;

			switch (options.type) {
				case "vtt.music":
					volume *= settings.audio.musicVolume;
					break;

				case "vtt.pings":
					volume *= settings.audio.pingVolume;
					if (options.sourceId) {
						const userSettings = getUserAudioSettings(options.sourceId as Guid);
						volume *= userSettings.pingVolume;
					}
					break;

				case "vtt.effects":
					volume *= settings.audio.effectsVolume;
					break;

				case "players.greetings":
				case "players.self_greeting":
					volume *= settings.audio.greetingsVolume;
					break;
			}

			return volume;
		},
		[settings.audio, getUserAudioSettings],
	);

	const play = useCallback(
		(options: AudioPlayOptions) => {
			const volumeMultiplier = getVolumeMultiplier(options);
			return playAudio({
				...options,
				volume: (options.volume ?? 1) * volumeMultiplier,
			});
		},
		[playAudio, getVolumeMultiplier],
	);

	const value = useMemo(
		() => ({
			play,
		}),
		[play],
	);

	return (
		<VttAudioControllerContext.Provider value={value}>
			{children}
		</VttAudioControllerContext.Provider>
	);
}

export function useVttAudioController(): VttAudioControllerContextValue {
	const context = useContext(VttAudioControllerContext);
	if (!context) {
		throw new Error(
			"useVttAudioController must be used inside a VttAudioControllerProvider.",
		);
	}
	return context;
}
