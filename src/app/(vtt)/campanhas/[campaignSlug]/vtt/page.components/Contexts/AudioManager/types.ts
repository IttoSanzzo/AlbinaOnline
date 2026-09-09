export type AudioCategory = string;
export type AudioSourceId = string;

export const STORAGE_KEY = "albina.audio.settings";

export const DEFAULT_SETTINGS: StoredAudioSettings = {
	globalVolume: 1,
	categoryVolumes: {},
	sourceVolumes: {},
	muted: false,
};

export interface AudioPlayOptions {
	path: string;
	type?: AudioCategory;
	sourceId?: AudioSourceId;
	volume?: number;
	loop?: boolean;
}

export interface AudioHandle {
	id: string;
	audio: HTMLAudioElement;
	stop: () => void;
	pause: () => void;
	resume: () => void;
}

export interface AudioPlayback {
	audio: HTMLAudioElement;
	type?: AudioCategory;
	sourceId?: AudioSourceId;
	localVolume: number;
}

export interface StoredAudioSettings {
	globalVolume: number;
	categoryVolumes: Record<string, number>;
	sourceVolumes: Record<string, number>;
	muted: boolean;
}
