import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionPropsText,
	NotionTextColor,
} from "@/utils/NotionBasedUtils";
import { NotionDivisorContainer } from "./styledElements";
import { CSSProperties } from "react";

interface NotionDivisorProps {
	color?: keyof typeof NotionTextColor;
}

export default function NotionDivisor({
	color = "default",
}: NotionDivisorProps) {
	const style: CSSProperties = {
		backgroundColor: `${NotionTextColor[color]}35`,
	};

	return <NotionDivisorContainer style={style} />;
}
