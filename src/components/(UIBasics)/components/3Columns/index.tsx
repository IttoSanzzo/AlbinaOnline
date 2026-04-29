import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const ThreeColumnsContainer = newStyledElement.div(
	styles.threeColumnsContainer,
);
const LeftColumContainer = newStyledElement.div(styles.leftColumContainer);
const MiddleColumContainer = newStyledElement.div(styles.middleColumContainer);
const RightColumContainer = newStyledElement.div(styles.rightColumContainer);

interface ThreeColumnsProps {
	colum1?: ReactNode;
	colum2?: ReactNode;
	colum3?: ReactNode;
	justifyContent1?: "left" | "center" | "right";
	justifyContent2?: "left" | "center" | "right";
	justifyContent3?: "left" | "center" | "right";
	withoutPadding?: boolean;
	withoutGap?: boolean;
	withoutBorderRadius?: boolean;
}

export function ThreeColumns({
	colum1 = null,
	colum2 = null,
	colum3 = null,
	justifyContent1,
	justifyContent2,
	justifyContent3,
	withoutPadding,
	withoutGap,
	withoutBorderRadius,
}: ThreeColumnsProps) {
	const containerStyle: CSSProperties = {
		...(withoutGap && { gap: 0 }),
	};
	const colum1Style: CSSProperties = {
		...(justifyContent1 && { justifyContent: justifyContent1 }),
		...(withoutPadding && { padding: 0 }),
		...(withoutBorderRadius && { borderRadius: 0 }),
	};
	const colum2Style: CSSProperties = {
		...(justifyContent2 && { justifyContent: justifyContent2 }),
		...(withoutPadding && { padding: 0 }),
		...(withoutBorderRadius && { borderRadius: 0 }),
	};
	const colum3Style: CSSProperties = {
		...(justifyContent3 && { justifyContent: justifyContent3 }),
		...(withoutPadding && { padding: 0 }),
		...(withoutBorderRadius && { borderRadius: 0 }),
	};

	return (
		<ThreeColumnsContainer style={containerStyle}>
			<LeftColumContainer style={colum1Style}>{colum1}</LeftColumContainer>
			<MiddleColumContainer style={colum2Style}>{colum2}</MiddleColumContainer>
			<RightColumContainer style={colum3Style}>{colum3}</RightColumContainer>
		</ThreeColumnsContainer>
	);
}
