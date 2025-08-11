import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartBackgroundColor } from "../../core";
import { UIBasics } from "../..";

export const ContentContainerColumn = newStyledElement.div(
	styles.contentContainerColumn
);
export const ContentContainerRow = newStyledElement.div(
	styles.contentContainerRow
);

interface GridListProps {
	children: ReactNode;
	columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	backgroundColor?: keyof typeof StandartBackgroundColor;
	columnWidth?: number;
	direction?: "row" | "column";
	withoutPadding?: boolean;
	withoutBorder?: boolean;
	withoutMargin?: boolean;
}
export function GridList({
	children,
	columns,
	columnWidth,
	backgroundColor,
	direction = "column",
	withoutBorder = false,
	withoutMargin = false,
	withoutPadding = false,
}: GridListProps) {
	if (direction === "column") {
		const columnsStyle: CSSProperties = {
			...(columns && { columnCount: columns }),
			...(columnWidth && { columnWidth: `${columnWidth}px` }),
		};

		return (
			<UIBasics.Box
				withoutBorder={withoutBorder}
				withoutMargin={withoutMargin}
				withoutPadding={withoutPadding}
				backgroundColor={backgroundColor}>
				<ContentContainerColumn
					style={columnsStyle}
					children={children}
				/>
			</UIBasics.Box>
		);
	}
	const columnsStyle: CSSProperties = {
		...(columnWidth && {
			gridTemplateColumns: `repeat(auto-fit, minmax(${columnWidth}px, 1fr))`,
		}),
	};

	return (
		<UIBasics.Box
			withoutBorder={withoutBorder}
			withoutMargin={withoutMargin}
			withoutPadding={withoutPadding}
			backgroundColor={backgroundColor}>
			<ContentContainerRow
				style={columnsStyle}
				children={children}
			/>
		</UIBasics.Box>
	);
}
