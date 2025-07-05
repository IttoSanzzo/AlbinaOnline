import { CSSProperties, ReactNode } from "react";
import { ContentContainer, NotionGridListContainer } from "./styledElements";
import { NotionBackgroundColor, NotionBox } from "@/components/(NotionBased)";

interface NotionGridListProps {
	children: ReactNode;
	columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	backgroundColor?: keyof typeof NotionBackgroundColor;
	minColumnWidth?: number;
}

export function NotionGridList({
	children,
	columns,
	minColumnWidth,
	backgroundColor,
}: NotionGridListProps) {
	const columnsStyle: CSSProperties = {
		...(columns && { columnCount: columns }),
		...(minColumnWidth && { columnWidth: `${minColumnWidth}px` }),
	};

	return (
		<NotionBox backgroundColor={backgroundColor}>
			<NotionGridListContainer>
				<ContentContainer style={columnsStyle}>{children}</ContentContainer>
			</NotionGridListContainer>
		</NotionBox>
	);
}
