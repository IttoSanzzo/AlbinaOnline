import { CSSProperties, Fragment, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartBackgroundColor, StandartColorProps } from "../../core";
import {
	StandartBackgroundColorKeyToProperty,
	StandartTextColorKeyToProperty,
	UIBasics,
} from "../..";

const HorizontalTableContainer = newStyledElement.table(
	styles.horizontalTableContainer,
);
const VerticalTableContainer = newStyledElement.table(
	styles.verticalTableContainer,
);

export interface TableData {
	tableLanes: Array<ReactNode[]>;
	subLanes?: (ReactNode | undefined)[];
}

interface TableProps extends StandartColorProps {
	tableData: TableData;
	direction?: "row" | "column";
	fixedLinePositions?: number[];
	fixedLineWidths?: number[];
	columnBackgroundColors?: (keyof typeof StandartBackgroundColor | undefined)[];
	withHeaderRow?: boolean;
	withHeaderColumn?: boolean;
	withoutBorderRadius?: boolean;
	withoutMargin?: boolean;
	style?: CSSProperties;
	id?: string;
	className?: string;
	borderCollapse?: boolean;
}

export function Table({
	tableData: { tableLanes, subLanes = [] },
	direction = "row",
	fixedLinePositions = [],
	fixedLineWidths = [],
	columnBackgroundColors = [],
	withHeaderRow = false,
	withHeaderColumn = true,
	borderCollapse = true,
	textColor,
	backgroundColor,
	withoutBorderRadius,
	withoutMargin,
	style,
	id,
	className,
}: TableProps) {
	const baseStyle: CSSProperties = {
		color: StandartTextColorKeyToProperty(textColor),
		backgroundColor: StandartBackgroundColorKeyToProperty(backgroundColor),
		...(withoutBorderRadius && { borderRadius: 0 }),
		...(withoutMargin && {
			margin: 0,
		}),
		...(borderCollapse && { borderCollapse: "collapse" }),
		...style,
	};

	if (fixedLinePositions.length != fixedLineWidths.length)
		return (
			<UIBasics.Text
				id={id}
				textColor="red"
				backgroundColor="yellow"
				children="UIBasics.Table: fixedLinePositions and fixedLineWidths should not have different lengths."
			/>
		);

	if (direction === "row") {
		if (subLanes.length > 0 && subLanes.length != tableLanes.length)
			return (
				<UIBasics.Text
					id={id}
					textColor="red"
					backgroundColor="yellow"
					children="UIBasics.Table: SubLanes and TableLanes must have the same length."
				/>
			);

		let fixedPositionIndex = -1;
		return (
			<HorizontalTableContainer
				className={className}
				style={baseStyle}
				id={id}>
				<tbody>
					{tableLanes.map((row, laneIndex) => (
						<Fragment key={laneIndex}>
							<tr
								className={styles.horizontalTableRow}
								// style={
								// 	subLanes[laneIndex] != undefined
								// 		? { margin: "none" }
								// 		: undefined
								// }
							>
								{row.map((column, rowIndex) => {
									const CellTag = rowIndex === 0 ? "th" : "td";
									return (
										<CellTag
											key={rowIndex}
											style={{
												...(fixedLineWidths.length > 0 &&
													fixedLinePositions.includes(rowIndex + 1) && {
														width: `${fixedLineWidths[++fixedPositionIndex]}%`,
													}),
												...(rowIndex < columnBackgroundColors.length &&
													columnBackgroundColors[rowIndex] != undefined && {
														backgroundColor:
															StandartBackgroundColor[
																columnBackgroundColors[rowIndex]
															],
													}),
												...(withHeaderRow &&
													laneIndex === 0 && {
														backgroundColor: "#202024",
													}),
												...(withHeaderColumn &&
													rowIndex === 0 && {
														backgroundColor: "#202024",
													}),
											}}>
											{column}
										</CellTag>
									);
								})}
							</tr>
							{subLanes[laneIndex] && (
								<tr className={styles.horizontalSubLaneRow}>
									<td colSpan={row.length}>{subLanes[laneIndex]}</td>
								</tr>
							)}
						</Fragment>
					))}
				</tbody>
			</HorizontalTableContainer>
		);
	}

	const reordenedTable: Array<ReactNode[]> = Array.from(
		{ length: tableLanes.length < 2 ? 2 : tableLanes.length },
		() => [],
	);
	if (subLanes.length > 0 && subLanes.length != reordenedTable.length)
		return (
			<UIBasics.Text
				id={id}
				textColor="red"
				backgroundColor="yellow"
				children="UIBasics.Table: SubLanes and TableLanes must have the same length."
			/>
		);

	tableLanes.forEach((column, columnIndex) => {
		column.forEach((entry, entryIndex) => {
			if (reordenedTable[entryIndex])
				reordenedTable[entryIndex][columnIndex] = entry;
		});
	});
	let fixedPositionIndex = -1;

	return (
		<VerticalTableContainer
			className={className}
			style={baseStyle}
			id={id}>
			<thead>
				<tr>
					{reordenedTable[0].map((content, index) => (
						<th
							style={{
								...(fixedLineWidths.length > 0 &&
									fixedLinePositions.includes(index + 1) && {
										width: `${fixedLineWidths[++fixedPositionIndex]}%`,
									}),
								...(columnBackgroundColors.length > 0 &&
									columnBackgroundColors[0] != undefined && {
										backgroundColor:
											StandartBackgroundColor[columnBackgroundColors[0]],
									}),
							}}
							key={index}>
							{content}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{reordenedTable.slice(1).map((column, rowIndex) => (
					<tr key={rowIndex}>
						{column.map((columnContent, columnIndex) => (
							<td
								style={{
									...(rowIndex <= columnBackgroundColors.length &&
										columnBackgroundColors[rowIndex + 1] != undefined && {
											backgroundColor:
												StandartBackgroundColor[
													columnBackgroundColors[rowIndex + 1]!
												],
										}),
								}}
								key={columnIndex}>
								{columnContent}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</VerticalTableContainer>
	);
}
