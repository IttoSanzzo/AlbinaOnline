import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const TwoColumnsContainer = newStyledElement.div(styles.twoColumnsContainer);
const LeftColumContainer = newStyledElement.div(styles.leftColumContainer);
const RightColumContainer = newStyledElement.div(styles.rightColumContainer);

function getFlexGrowFromDivision(ratio: number, side: 1 | 2): number {
	const center = 5;
	const clamped = Math.max(-5, Math.min(5, ratio));
	if (side == 1) return center + clamped;
	return center - clamped;
}

interface TwoColumnsProps {
	colum1?: ReactNode;
	colum2?: ReactNode;
	justifyContent1?: "left" | "center" | "right";
	justifyContent2?: "left" | "center" | "right";
	divisionRatio?: -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;
	withoutPadding?: boolean;
	withoutGap?: boolean;
	withoutBorderRadius?: boolean;
}

export function TwoColumns({
	colum1 = null,
	colum2 = null,
	justifyContent1,
	justifyContent2,
	divisionRatio = 0,
	withoutPadding,
	withoutGap,
	withoutBorderRadius,
}: TwoColumnsProps) {
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
		<TwoColumnsContainer style={containerStyle}>
			<LeftColumContainer style={colum1Style}>{colum1}</LeftColumContainer>
			<RightColumContainer style={colum2Style}>{colum2}</RightColumContainer>
		</TwoColumnsContainer>
	);
}
