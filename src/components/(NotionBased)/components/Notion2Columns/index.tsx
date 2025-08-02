import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const Notion2ColumnsContainer = newStyledElement.div(
	styles.notion2ColumnsContainer
);
export const LeftColumContainer = newStyledElement.div(
	styles.leftColumContainer
);
export const RightColumContainer = newStyledElement.div(
	styles.rightColumContainer
);

function getFlexGrowFromDivision(ratio: number, side: 1 | 2): number {
	const center = 5;
	const clamped = Math.max(-5, Math.min(5, ratio));
	if (side == 1) return center + clamped;
	return center - clamped;
}

interface Notion2ColumnsProps {
	colum1?: ReactNode;
	colum2?: ReactNode;
	justifyContent1?: "left" | "center" | "right";
	justifyContent2?: "left" | "center" | "right";
	divisionRatio?: -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;
	withoutPadding?: boolean;
	withoutGap?: boolean;
	withoutBorderRadius?: boolean;
}

export function Notion2Columns({
	colum1 = null,
	colum2 = null,
	justifyContent1,
	justifyContent2,
	divisionRatio = 0,
	withoutPadding,
	withoutGap,
	withoutBorderRadius,
}: Notion2ColumnsProps) {
	const containerStyle: CSSProperties = {
		...(withoutGap && { gap: 0 }),
	};
	const colum1Style: CSSProperties = {
		...(justifyContent1 && { justifyContent: justifyContent1 }),
		...(divisionRatio && { flex: getFlexGrowFromDivision(divisionRatio, 1) }),
		...(withoutPadding && { padding: 0 }),
		...(withoutBorderRadius && { borderRadius: 0 }),
	};
	const colum2Style: CSSProperties = {
		...(justifyContent2 && { justifyContent: justifyContent2 }),
		...(divisionRatio && { flex: getFlexGrowFromDivision(divisionRatio, 2) }),
		...(withoutPadding && { padding: 0 }),
		...(withoutBorderRadius && { borderRadius: 0 }),
	};

	return (
		<Notion2ColumnsContainer style={containerStyle}>
			<LeftColumContainer style={colum1Style}>{colum1}</LeftColumContainer>
			<RightColumContainer style={colum2Style}>{colum2}</RightColumContainer>
		</Notion2ColumnsContainer>
	);
}
