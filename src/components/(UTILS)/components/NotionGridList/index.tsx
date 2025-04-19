import { CSSProperties, ReactNode } from "react";
import { ContentContainer, NotionGridListContainer } from "./styledElements";
import {
	NotionBackgroundColor,
	NotionCallout,
} from "@/components/(NotionBased)";

interface NotionGridListProps {
	children: ReactNode;
	columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	backgroundColor?: keyof typeof NotionBackgroundColor;
	minColumnWidth?: "150px" | "200px" | "250px" | "300px";
}

export function NotionGridList({
	children,
	columns,
	minColumnWidth,
	backgroundColor,
}: NotionGridListProps) {
	const style: CSSProperties = {
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
	};

	const columnsStyle: CSSProperties = {
		...(columns && { columnCount: columns }),
		...(minColumnWidth && { columnWidth: minColumnWidth }),
	};

	return (
		<NotionGridListContainer style={style}>
			<NotionCallout>
				<ContentContainer style={columnsStyle}>{children}</ContentContainer>
			</NotionCallout>
		</NotionGridListContainer>
	);
}
