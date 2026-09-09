import { VttAudioUserLocalSettings, VttLocalSettings } from "./types";

export const VttDefaultLocatlSettings: VttLocalSettings = {
	hud: {
		showCoordinates: true,
		showEdgeBleed: true,
	},
	audio: {
		masterVolume: 1,
		musicVolume: 1,
		effectsVolume: 1,
		pingVolume: 1,
		greetingsVolume: 1,
		users: {},
	},
};

export const VttDefaultUserAudioSettings: VttAudioUserLocalSettings = {
	pingVolume: 1,
};
