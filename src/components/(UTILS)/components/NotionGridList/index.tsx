import { CSSProperties, ReactNode } from "react";
import { ContentContainerColumn, ContentContainerRow } from "./styledElements";
import { NotionBackgroundColor, NotionBox } from "@/components/(NotionBased)";

interface NotionGridListProps {
	children: ReactNode;
	columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	backgroundColor?: keyof typeof NotionBackgroundColor;
	columnWidth?: number;
	direction?: "row" | "column";
}

export function NotionGridList({
	children,
	columns,
	columnWidth,
	backgroundColor,
	direction = "column",
}: NotionGridListProps) {
	if (direction === "column") {
		const columnsStyle: CSSProperties = {
			...(columns && { columnCount: columns }),
			...(columnWidth && { columnWidth: `${columnWidth}px` }),
		};

		return (
			<NotionBox backgroundColor={backgroundColor}>
				<ContentContainerColumn
					style={columnsStyle}
					children={children}
				/>
			</NotionBox>
		);
	}
	const columnsStyle: CSSProperties = {
		...(columnWidth && {
			gridTemplateColumns: `repeat(auto-fit, minmax(${columnWidth}px, 1fr))`,
		}),
	};

	return (
		<NotionBox backgroundColor={backgroundColor}>
			<ContentContainerRow
				style={columnsStyle}
				children={children}
			/>
		</NotionBox>
	);
}
