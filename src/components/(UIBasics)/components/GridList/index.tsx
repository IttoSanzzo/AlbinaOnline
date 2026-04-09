import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartBackgroundColor } from "../../core";
import { UIBasics } from "../..";

const ContentContainerColumn = newStyledElement.div(
	styles.contentContainerColumn,
);
const ContentContainerRow = newStyledElement.div(styles.contentContainerRow);

interface GridListProps {
	children: ReactNode;
	columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	backgroundColor?: keyof typeof StandartBackgroundColor;
	columnWidth?: CSSProperties["columnWidth"];
	direction?: "row" | "column";
	withoutPadding?: boolean;
	withoutBorder?: boolean;
	withoutMargin?: boolean;
	style?: CSSProperties;
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
	style,
}: GridListProps) {
	if (Number.isInteger(columnWidth)) columnWidth = `${columnWidth}px`;
	if (direction === "column") {
		const columnsStyle: CSSProperties = {
			...(columns && { columnCount: columns }),
			...(columnWidth && { columnWidth: columnWidth }),
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
		...(columnWidth != undefined && {
			gridTemplateColumns: `repeat(auto-fit, minmax(${columnWidth}, 1fr))`,
		}),
	};

	return (
		<UIBasics.Box
			withoutBorder={withoutBorder}
			withoutMargin={withoutMargin}
			withoutPadding={withoutPadding}
			backgroundColor={backgroundColor}
			style={style}>
			<ContentContainerRow
				style={columnsStyle}
				children={children}
			/>
		</UIBasics.Box>
	);
}
