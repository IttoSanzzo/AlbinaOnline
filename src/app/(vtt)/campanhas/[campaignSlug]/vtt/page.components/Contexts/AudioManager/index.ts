"use client";

import {
	AudioCategory,
	AudioHandle,
	AudioPlayback,
	AudioPlayOptions,
	AudioSourceId,
	DEFAULT_SETTINGS,
	STORAGE_KEY,
	StoredAudioSettings,
} from "./types";

function clampVolume(volume: number): number {
	return Math.max(0, Math.min(1, volume));
}

function normalizeCategory(category?: AudioCategory): string | undefined {
	if (!category) return undefined;
	const normalized = category.trim().replace(/^.+|.+$/g, "");
	return normalized || undefined;
}

export class AudioManager {
	private settings: StoredAudioSettings;
	private readonly playing = new Map<string, AudioPlayback>();
	private readonly preloaded = new Map<string, HTMLAudioElement>();
	private nextPlaybackId = 0;

	public constructor() {
		this.settings = this.loadSettings();
	}

	private loadSettings(): StoredAudioSettings {
		if (typeof window === "undefined")
			return {
				...DEFAULT_SETTINGS,
				categoryVolumes: {},
				sourceVolumes: {},
			};

		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);

			if (!stored)
				return {
					...DEFAULT_SETTINGS,
					categoryVolumes: {},
					sourceVolumes: {},
				};

			const parsed = JSON.parse(stored) as Partial<StoredAudioSettings>;

			return {
				globalVolume:
					typeof parsed.globalVolume === "number"
						? clampVolume(parsed.globalVolume)
						: DEFAULT_SETTINGS.globalVolume,

				categoryVolumes:
					parsed.categoryVolumes && typeof parsed.categoryVolumes === "object"
						? parsed.categoryVolumes
						: {},

				sourceVolumes:
					parsed.sourceVolumes && typeof parsed.sourceVolumes === "object"
						? parsed.sourceVolumes
						: {},

				muted:
					typeof parsed.muted === "boolean"
						? parsed.muted
						: DEFAULT_SETTINGS.muted,
			};
		} catch {
			return {
				...DEFAULT_SETTINGS,
				categoryVolumes: {},
				sourceVolumes: {},
			};
		}
	}

	private saveSettings(): void {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
		} catch {
			// localStorage may be unavailable.
		}
	}

	private getSourceVolumeKey(
		type?: AudioCategory,
		sourceId?: AudioSourceId,
	): string | undefined {
		const normalizedType = normalizeCategory(type);
		if (!normalizedType || !sourceId) return undefined;
		return `${normalizedType}:${sourceId}`;
	}

	public getEffectiveVolume(
		type?: AudioCategory,
		sourceId?: AudioSourceId,
		localVolume = 1,
	): number {
		if (this.settings.muted) return 0;

		let volume = clampVolume(localVolume);
		volume *= clampVolume(this.settings.globalVolume);
		volume *= this.getCategoryVolume(type);

		const sourceVolumeKey = this.getSourceVolumeKey(type, sourceId);

		if (sourceVolumeKey) {
			const sourceVolume = this.settings.sourceVolumes[sourceVolumeKey];
			if (typeof sourceVolume === "number") volume *= clampVolume(sourceVolume);
		}

		return clampVolume(volume);
	}

	public async play(
		options: AudioPlayOptions,
	): Promise<AudioHandle | undefined> {
		if (typeof window === "undefined") return undefined;

		const id = `${Date.now()}-${this.nextPlaybackId++}`;

		const normalizedType = normalizeCategory(options.type);
		const localVolume = clampVolume(options.volume ?? 1);

		let audio = this.preloaded.get(options.path);

		if (audio) audio = audio.cloneNode(true) as HTMLAudioElement;
		else audio = new Audio(options.path);

		audio.volume = this.getEffectiveVolume(
			normalizedType,
			options.sourceId,
			localVolume,
		);

		audio.loop = options.loop ?? false;

		const playback: AudioPlayback = {
			audio,
			type: normalizedType,
			sourceId: options.sourceId,
			localVolume,
		};

		this.playing.set(id, playback);
		const cleanup = () => {
			this.playing.delete(id);
		};

		audio.addEventListener("ended", cleanup, { once: true });
		audio.addEventListener("error", cleanup, { once: true });

		try {
			await audio.play();
		} catch (error) {
			cleanup();
			throw error;
		}

		return {
			id,
			audio,
			stop: () => this.stop(id),
			pause: () => this.pause(id),
			resume: () => this.resume(id),
		};
	}

	public preload(path: string): HTMLAudioElement | undefined {
		if (typeof window === "undefined") return undefined;
		const existing = this.preloaded.get(path);
		if (existing) return existing;
		const audio = new Audio(path);
		audio.preload = "auto";
		this.preloaded.set(path, audio);
		return audio;
	}

	public unload(path: string): void {
		const audio = this.preloaded.get(path);
		if (!audio) return;
		audio.pause();
		audio.src = "";
		this.preloaded.delete(path);
	}

	public stop(id: string): void {
		const playback = this.playing.get(id);
		if (!playback) return;
		playback.audio.pause();
		playback.audio.currentTime = 0;
		this.playing.delete(id);
	}

	public pause(id: string): void {
		this.playing.get(id)?.audio.pause();
	}

	public resume(id: string): void {
		const playback = this.playing.get(id);
		if (!playback) return;
		void playback.audio.play().catch(() => {});
	}

	public stopAll(): void {
		for (const playback of this.playing.values()) {
			playback.audio.pause();
			playback.audio.currentTime = 0;
		}
		this.playing.clear();
	}

	public pauseAll(): void {
		for (const playback of this.playing.values()) playback.audio.pause();
	}

	public resumeAll(): void {
		for (const playback of this.playing.values())
			void playback.audio.play().catch(() => {});
	}

	public getGlobalVolume(): number {
		return this.settings.globalVolume;
	}

	public setGlobalVolume(volume: number): void {
		this.settings.globalVolume = clampVolume(volume);
		this.saveSettings();
		this.refreshPlayingVolumes();
	}

	public getCategoryVolume(type?: AudioCategory): number {
		const normalizedType = normalizeCategory(type);
		if (!normalizedType) return 1;
		const parts = normalizedType.split(".");
		let volume = 1;
		for (let index = 1; index <= parts.length; index++) {
			const category = parts.slice(0, index).join(".");
			const categoryVolume = this.settings.categoryVolumes[category];
			if (typeof categoryVolume === "number")
				volume *= clampVolume(categoryVolume);
		}
		return volume;
	}

	public setCategoryVolume(type: AudioCategory, volume: number): void {
		const normalizedType = normalizeCategory(type);
		if (!normalizedType) return;
		this.settings.categoryVolumes[normalizedType] = clampVolume(volume);
		this.saveSettings();
		this.refreshPlayingVolumes();
	}

	public resetCategoryVolume(type: AudioCategory): void {
		const normalizedType = normalizeCategory(type);
		if (!normalizedType) return;
		delete this.settings.categoryVolumes[normalizedType];
		this.saveSettings();
		this.refreshPlayingVolumes();
	}

	public getSourceVolume(type: AudioCategory, sourceId: AudioSourceId): number {
		const key = this.getSourceVolumeKey(type, sourceId);
		if (!key) return 1;
		return this.settings.sourceVolumes[key] ?? 1;
	}

	public setSourceVolume(
		type: AudioCategory,
		sourceId: AudioSourceId,
		volume: number,
	): void {
		const key = this.getSourceVolumeKey(type, sourceId);
		if (!key) return;
		this.settings.sourceVolumes[key] = clampVolume(volume);
		this.saveSettings();
		this.refreshPlayingVolumes();
	}

	public resetSourceVolume(type: AudioCategory, sourceId: AudioSourceId): void {
		const key = this.getSourceVolumeKey(type, sourceId);
		if (!key) return;
		delete this.settings.sourceVolumes[key];
		this.saveSettings();
		this.refreshPlayingVolumes();
	}

	public isMuted(): boolean {
		return this.settings.muted;
	}

	public setMuted(muted: boolean): void {
		this.settings.muted = muted;
		this.saveSettings();
		this.refreshPlayingVolumes();
	}

	public toggleMuted(): boolean {
		this.setMuted(!this.settings.muted);
		return this.settings.muted;
	}

	private refreshPlayingVolumes(): void {
		for (const playback of this.playing.values()) {
			playback.audio.volume = this.getEffectiveVolume(
				playback.type,
				playback.sourceId,
				playback.localVolume,
			);
		}
	}

	public getSettings(): Readonly<StoredAudioSettings> {
		return this.settings;
	}
}
