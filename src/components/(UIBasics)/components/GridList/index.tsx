import { CSSProperties, Children, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartBackgroundColor } from "../../core";
import { UIBasics } from "../..";

const ContentContainerColumn = newStyledElement.div(
	styles.contentContainerColumn,
);
const ContentContainerRow = newStyledElement.div(styles.contentContainerRow);
const ContentContainerMasonry = newStyledElement.div(
	styles.contentContainerMasonry,
);
const MasonryColumn = newStyledElement.div(styles.masonryColumn);

interface GridListProps {
	children: ReactNode;
	columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	backgroundColor?: keyof typeof StandartBackgroundColor;
	columnWidth?: CSSProperties["columnWidth"];
	direction?: "row" | "column" | "masonry";
	withoutPadding?: boolean;
	withoutBorder?: boolean;
	withoutMargin?: boolean;
	className?: string;
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
	className,
	style,
}: GridListProps) {
	if (Number.isInteger(columnWidth)) columnWidth = `${columnWidth}px`;

	if (direction === "column") {
		const columnsStyle: CSSProperties = {
			...(columns && { columnCount: columns }),
			...(columnWidth && { columnWidth }),
		};

		return (
			<UIBasics.Box
				withoutBorder={withoutBorder}
				withoutMargin={withoutMargin}
				withoutPadding={withoutPadding}
				backgroundColor={backgroundColor}
				className={className}>
				<ContentContainerColumn
					style={columnsStyle}
					children={children}
				/>
			</UIBasics.Box>
		);
	}

	if (direction === "masonry") {
		const childArray = Children.toArray(children);
		const columnCount = columns ?? 2;
		const masonryColumns: ReactNode[][] = Array.from(
			{ length: columnCount },
			() => [],
		);

		childArray.forEach((child, index) => {
			masonryColumns[index % columnCount].push(child);
		});

		const masonryStyle: CSSProperties = {
			gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
			...(columnWidth && {
				gridTemplateColumns: `repeat(${columnCount}, minmax(${columnWidth}, 1fr))`,
			}),
		};

		return (
			<UIBasics.Box
				withoutBorder={withoutBorder}
				withoutMargin={withoutMargin}
				withoutPadding={withoutPadding}
				backgroundColor={backgroundColor}
				className={className}
				style={style}>
				<ContentContainerMasonry style={masonryStyle}>
					{masonryColumns.map((column, index) => (
						<MasonryColumn key={index}>{column}</MasonryColumn>
					))}
				</ContentContainerMasonry>
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
			style={style}
			className={className}>
			<ContentContainerRow
				style={columnsStyle}
				children={children}
			/>
		</UIBasics.Box>
	);
}
