import { ColumContainer, Notion2ColumnsContainer } from "./styledElements";
import { CSSProperties, ReactNode } from "react";

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
}

export default function Notion2Columns({
	colum1 = null,
	colum2 = null,
	justifyContent1,
	justifyContent2,
	divisionRatio = 0,
}: Notion2ColumnsProps) {
	const colum1Style: CSSProperties = {
		...(justifyContent1 && { justifyContent: justifyContent1 }),
		...(divisionRatio && { flex: getFlexGrowFromDivision(divisionRatio, 1) }),
	};
	const colum2Style: CSSProperties = {
		...(justifyContent2 && { justifyContent: justifyContent2 }),
		...(divisionRatio && { flex: getFlexGrowFromDivision(divisionRatio, 2) }),
	};

	return (
		<Notion2ColumnsContainer>
			<ColumContainer style={colum1Style}>{colum1}</ColumContainer>
			<ColumContainer style={colum2Style}>{colum2}</ColumContainer>
		</Notion2ColumnsContainer>
	);
}
