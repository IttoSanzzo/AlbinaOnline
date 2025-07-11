import { CSSProperties, ReactNode } from "react";
import { AlertDialogButtonsContainer } from "./styledElements";

interface ButtonsContainerProps {
	alignment?: "start" | "center" | "end";
	children: ReactNode;
}
export function ButtonsContainer({
	alignment = "center",
	children,
}: ButtonsContainerProps) {
	const containerStyle: CSSProperties = {
		...(alignment != "center" && {
			justifyContent: `flex-${alignment}`,
		}),
	};
	return (
		<AlertDialogButtonsContainer
			style={containerStyle}
			children={children}
		/>
	);
}
