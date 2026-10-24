"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { ReactNode as ReactContent } from "react";
import { RadialMenu } from "../index";
import {
	RadialMenuCoreGeneratorProps,
	RadialMenuOption,
	RadialMenuSubmitProps,
} from "../types";

export interface RadialMenuData {
	id: string;
	name: string;
	mode?: "fast" | "switch";
	overlay?: boolean;
	seekMouseOutside?: boolean;
	screenPosition: CoordinatePair;
	actionPosition: CoordinatePair;
	coreDiameter?: number;
	ringWidths?: number[];
	options: RadialMenuOption[];
	nameColor?: string;
	showNames?: boolean;
	submitKeys?: string[];
	coreGenerator?: (props: RadialMenuCoreGeneratorProps) => ReactContent;
	onSubmit: (props: RadialMenuSubmitProps) => void;
}

export interface RadialMenuActions {
	openNew: (props: RadialMenuData) => void;
	close: () => void;
}

export interface RadialMenuContext extends RadialMenuActions {
	id: string | null;
}

const RadialMenuActionsContext = createContext<RadialMenuActions | undefined>(
	undefined,
);
const RadialMenuIdContext = createContext<string | null | undefined>(undefined);

export function RadialMenuProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<RadialMenuData | null>(null);

	const openNew = useCallback((props: RadialMenuData) => {
		setSession({
			...props,
			mode: props.mode ?? "fast",
			overlay: props.overlay ?? false,
			seekMouseOutside: props.seekMouseOutside ?? true,
			showNames: props.showNames ?? true,
		});
	}, []);

	const close = useCallback(() => {
		setSession(null);
	}, []);

	const actions = useMemo<RadialMenuActions>(
		() => ({ openNew, close }),
		[openNew, close],
	);

	return (
		<RadialMenuActionsContext.Provider value={actions}>
			<RadialMenuIdContext.Provider value={session?.id ?? null}>
				{children}
				{session && (
					<RadialMenu
						key={session.id}
						{...session}
						onClose={close}
					/>
				)}
			</RadialMenuIdContext.Provider>
		</RadialMenuActionsContext.Provider>
	);
}

export function useRadialMenuActions(): RadialMenuActions {
	const context = useContext(RadialMenuActionsContext);
	if (!context)
		throw new Error(
			"useRadialMenuActions must be used inside a RadialMenuProvider.",
		);
	return context;
}

export function useRadialMenuId(): string | null {
	const id = useContext(RadialMenuIdContext);
	if (id === undefined)
		throw new Error(
			"useRadialMenuId must be used inside a RadialMenuProvider.",
		);
	return id;
}

export function useRadialMenu(): RadialMenuContext {
	return {
		...useRadialMenuActions(),
		id: useRadialMenuId(),
	};
}
