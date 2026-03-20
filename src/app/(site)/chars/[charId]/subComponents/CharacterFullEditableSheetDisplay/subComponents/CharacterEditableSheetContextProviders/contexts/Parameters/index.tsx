import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { CharacterParameters } from "@/libs/stp@types";

export const ParametersContext = createContext<{
	parameters: CharacterParameters;
	setParameters: React.Dispatch<React.SetStateAction<CharacterParameters>>;
}>(undefined!);

interface CharacterParametersContextProviderProps {
	parameters: CharacterParameters;
	children: ReactNode;
}
export function CharacterParametersContextProvider({
	parameters,
	children,
}: CharacterParametersContextProviderProps) {
	const parametersState = useState<CharacterParameters>(parameters);
	const parametersContextValue = useMemo(
		() => ({
			parameters: parametersState[0],
			setParameters: parametersState[1],
		}),
		[parametersState[0]],
	);
	useEffect(() => {
		parametersState[1](parameters);
	}, [parameters]);

	return (
		<ParametersContext.Provider value={parametersContextValue}>
			{children}
		</ParametersContext.Provider>
	);
}
