"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Guid } from "@/libs/stp@types";
import {
	LocalVttAudioSettings,
	LocalVttHudSettings,
	VttAudioUserLocalSettings,
	VttLocalSettings,
} from "./types";
import {
	VttDefaultLocatlSettings,
	VttDefaultUserAudioSettings,
} from "./VttDefaultLocalSettings";

interface VttLocalSettingsContextValue {
	settings: VttLocalSettings;
	updateSettings: (settings: Partial<VttLocalSettings>) => void;
	updateHudSettings: (settings: Partial<LocalVttHudSettings>) => void;
	updateAudioSettings: (settings: Partial<LocalVttAudioSettings>) => void;
	getUserAudioSettings: (userId: Guid) => VttAudioUserLocalSettings;
	updateUserAudioSettings: (
		userId: Guid,
		settings: Partial<VttAudioUserLocalSettings>,
	) => void;
	resetSettings: () => void;
}

const VttLocalSettingsContext =
	createContext<VttLocalSettingsContextValue | null>(null);

interface VttLocalSettingsProviderProps {
	vttId: Guid | null;
	children: ReactNode;
}

export function VttLocalSettingsProvider({
	vttId,
	children,
}: VttLocalSettingsProviderProps) {
	const [settings, setSettings] = useState<VttLocalSettings>(
		VttDefaultLocatlSettings,
	);
	const [loadedVttId, setLoadedVttId] = useState<Guid | null>(null);

	const storageKey = useMemo(
		() => (vttId ? `vttId=${vttId}|settings` : null),
		[vttId],
	);

	useEffect(() => {
		setLoadedVttId(null);
		if (!storageKey) {
			setSettings(VttDefaultLocatlSettings);
			return;
		}
		const stored = localStorage.getItem(storageKey);
		if (!stored) {
			setSettings(VttDefaultLocatlSettings);
			setLoadedVttId(vttId);
			return;
		}
		try {
			const parsed = JSON.parse(stored) as Partial<VttLocalSettings>;

			setSettings({
				...VttDefaultLocatlSettings,
				...parsed,
				hud: {
					...VttDefaultLocatlSettings.hud,
					...parsed.hud,
				},
				audio: {
					...VttDefaultLocatlSettings.audio,
					...parsed.audio,
					users: {
						...VttDefaultLocatlSettings.audio.users,
						...parsed.audio?.users,
					},
				},
			});
		} catch {
			setSettings(VttDefaultLocatlSettings);
		}
		setLoadedVttId(vttId);
	}, [storageKey, vttId]);
	useEffect(() => {
		if (!storageKey || loadedVttId !== vttId) return;
		localStorage.setItem(storageKey, JSON.stringify(settings));
	}, [storageKey, settings, loadedVttId, vttId]);

	const updateSettings = useCallback(
		(newSettings: Partial<VttLocalSettings>) => {
			setSettings((current) => ({
				...current,
				...newSettings,
			}));
		},
		[],
	);
	const updateHudSettings = useCallback(
		(newSettings: Partial<LocalVttHudSettings>) => {
			setSettings((current) => ({
				...current,
				hud: {
					...current.hud,
					...newSettings,
				},
			}));
		},
		[],
	);
	const updateAudioSettings = useCallback(
		(newSettings: Partial<LocalVttAudioSettings>) => {
			setSettings((current) => ({
				...current,
				audio: {
					...current.audio,
					...newSettings,
				},
			}));
		},
		[],
	);
	const updateUserAudioSettings = useCallback(
		(userId: Guid, newSettings: Partial<VttAudioUserLocalSettings>) => {
			setSettings((current) => ({
				...current,
				audio: {
					...current.audio,
					users: {
						...current.audio.users,
						[userId]: {
							...VttDefaultUserAudioSettings,
							...current.audio.users[userId],
							...newSettings,
						},
					},
				},
			}));
		},
		[],
	);

	const getUserAudioSettings = useCallback(
		(userId: Guid): VttAudioUserLocalSettings => {
			return {
				...VttDefaultUserAudioSettings,
				...settings.audio.users[userId],
			};
		},
		[settings.audio.users],
	);

	const resetSettings = useCallback(() => {
		setSettings(VttDefaultLocatlSettings);
	}, []);

	const value = useMemo(
		() => ({
			settings,
			updateSettings,
			updateHudSettings,
			updateAudioSettings,
			getUserAudioSettings,
			updateUserAudioSettings,
			resetSettings,
		}),
		[
			settings,
			updateSettings,
			updateHudSettings,
			updateAudioSettings,
			getUserAudioSettings,
			updateUserAudioSettings,
			resetSettings,
		],
	);

	return (
		<VttLocalSettingsContext.Provider value={value}>
			{children}
		</VttLocalSettingsContext.Provider>
	);
}

export function useVttLocalSettings() {
	const context = useContext(VttLocalSettingsContext);
	if (!context) {
		throw new Error(
			"useVttLocalSettings must be used inside VttLocalSettingsProvider",
		);
	}
	return context;
}
