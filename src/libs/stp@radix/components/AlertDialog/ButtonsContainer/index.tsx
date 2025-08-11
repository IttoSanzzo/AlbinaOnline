import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const AlertDialogButtonsContainer = newStyledElement.div(
	styles.alertDialogButtonsContainer
);

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
