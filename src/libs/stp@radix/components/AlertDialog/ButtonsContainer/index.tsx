import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const AlertDialogButtonsContainer = newStyledElement.div(
	styles.alertDialogButtonsContainer,
);

interface ButtonsContainerProps {
	alignment?: "start" | "center" | "end" | "space-between" | "space-around";
	children: ReactNode;
}
export function ButtonsContainer({
	alignment = "center",
	children,
}: ButtonsContainerProps) {
	const containerStyle: CSSProperties = {
		...(alignment != "center" && (alignment == "start" || alignment == "end")
			? {
					justifyContent: `flex-${alignment}`,
				}
			: {
					justifyContent: alignment,
				}),
	};
	return (
		<AlertDialogButtonsContainer
			style={containerStyle}
			children={children}
		/>
	);
}
