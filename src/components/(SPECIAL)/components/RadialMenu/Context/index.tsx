"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
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

interface RadialMenuContext {
	openNew: (props: RadialMenuData) => void;
	close: () => void;
	id: string | null;
}

const RadialMenuContext = createContext<RadialMenuContext | null>(null);

export function RadialMenuProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<RadialMenuData | null>(null);

	const openNew = useCallback((props: RadialMenuData) => {
		setSession({
			...props,
			mode: props.mode ?? "fast",
			overlay: props.overlay ?? false,
			showNames: props.showNames ?? true,
		});
	}, []);

	const close = useCallback(() => {
		setSession(null);
	}, []);

	return (
		<RadialMenuContext.Provider
			value={{
				openNew,
				close,
				id: session?.id ?? null,
			}}>
			{children}
			{session && (
				<RadialMenu
					key={session.id}
					{...session}
					onClose={close}
				/>
			)}
		</RadialMenuContext.Provider>
	);
}

export function useRadialMenu(): RadialMenuContext {
	const context = useContext(RadialMenuContext);
	if (!context)
		throw new Error("useRadialMenu must be used inside a RadialMenuProvider.");
	return context;
}
