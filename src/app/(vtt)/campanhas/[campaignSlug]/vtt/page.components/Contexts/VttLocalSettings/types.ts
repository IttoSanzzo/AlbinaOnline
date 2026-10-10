import { Guid } from "@/libs/stp@types";

export interface VttLocalSettings {
	hud: LocalVttHudSettings;
	audio: LocalVttAudioSettings;
}

export interface LocalVttHudSettings {
	showCoordinates: boolean;
	showEdgeBleed: boolean;
}

export interface LocalVttAudioSettings {
	masterVolume: number;
	musicVolume: number;
	effectsVolume: number;
	pingVolume: number;
	pingMuted: boolean;
	chatVolume: number;
	chatMuted: boolean;
	greetingsVolume: number;
	users: Partial<Record<Guid, VttAudioUserLocalSettings>>;
}

export interface VttAudioUserLocalSettings {
	pingVolume: number;
}
