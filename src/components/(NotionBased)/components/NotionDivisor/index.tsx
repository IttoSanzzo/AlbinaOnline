import { NotionTextColor } from "../../index";
import { NotionDivisorContainer } from "./styledElements";
import { CSSProperties } from "react";

interface NotionDivisorProps {
	color?: keyof typeof NotionTextColor;
}

export function NotionDivisor({ color = "default" }: NotionDivisorProps) {
	const style: CSSProperties = {
		backgroundColor: `${NotionTextColor[color]}35`,
	};

	return <NotionDivisorContainer style={style} />;
}
