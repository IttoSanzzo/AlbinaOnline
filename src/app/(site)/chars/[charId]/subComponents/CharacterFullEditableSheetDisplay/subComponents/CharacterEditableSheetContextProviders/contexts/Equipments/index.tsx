import { createContext, ReactNode, useMemo, useState } from "react";
import { CharacterEquipments } from "@/libs/stp@types";

export const EquipmentsContext = createContext<{
	characterEquipments: CharacterEquipments;
	setCharacterEquipments: React.Dispatch<
		React.SetStateAction<CharacterEquipments>
	>;
}>({
	characterEquipments: null!,
	setCharacterEquipments: () => {
		throw new Error("setCharacterEquipments called outside of provider");
	},
});

interface EquipmentsContextProviderProps {
	children: ReactNode;
}
export function EquipmentsContextProvider({
	children,
}: EquipmentsContextProviderProps) {
	const equipmentsState = useState<CharacterEquipments>(null!);
	const equipmentsContextValue = useMemo(
		() => ({
			characterEquipments: equipmentsState[0],
			setCharacterEquipments: equipmentsState[1],
		}),
		[equipmentsState[0]]
	);

	return (
		<EquipmentsContext.Provider value={equipmentsContextValue}>
			{children}
		</EquipmentsContext.Provider>
	);
}
