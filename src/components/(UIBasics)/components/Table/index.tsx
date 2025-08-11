import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartBackgroundColor, StandartColorProps } from "../../core";
import {
	StandartBackgroundColorKeyToProperty,
	StandartTextColorKeyToProperty,
	UIBasics,
} from "../..";

const HorizontalTableContainer = newStyledElement.table(
	styles.horizontalTableContainer
);
const VerticalTableContainer = newStyledElement.table(
	styles.verticalTableContainer
);

export interface TableData {
	tableLanes: Array<ReactNode[]>;
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
}

export function Table({
	tableData: { tableLanes },
	direction = "row",
	fixedLinePositions = [],
	fixedLineWidths = [],
	columnBackgroundColors = [],
	withHeaderRow = false,
	withHeaderColumn = true,
	textColor,
	backgroundColor,
	withoutBorderRadius,
	withoutMargin,
	style,
}: TableProps) {
	const baseStyle: CSSProperties = {
		color: StandartTextColorKeyToProperty(textColor),
		backgroundColor: StandartBackgroundColorKeyToProperty(backgroundColor),
		...(withoutBorderRadius && { borderRadius: 0 }),
		...(withoutMargin && {
			margin: 0,
		}),
		...style,
	};
	if (fixedLinePositions.length != fixedLineWidths.length)
		return (
			<UIBasics.Text
				textColor="red"
				backgroundColor="yellow"
				children="UIBasics.Table: fixedLinePositions and fixedLineWidths should not have different lengths."
			/>
		);

	if (direction === "row") {
		var fixedPositionIndex = -1;
		return (
			<HorizontalTableContainer style={baseStyle}>
				<tbody>
					{tableLanes.map((row, laneIndex) => (
						<tr key={laneIndex}>
							{row.map((column, rowIndex) => {
								const contentStyle = {
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
								};
								if (rowIndex === 0) {
									return (
										<th
											key={rowIndex}
											style={contentStyle}>
											{column}
										</th>
									);
								}
								return (
									<td
										key={rowIndex}
										style={contentStyle}>
										{column}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</HorizontalTableContainer>
		);
	}

	const newTableLength = tableLanes.length === 1 ? 2 : tableLanes.length;
	const reordenedTable: Array<ReactNode[]> = Array.from(
		{ length: newTableLength },
		() => []
	);

	tableLanes.forEach((column, columnIndex) => {
		for (var i = 0; i < column.length; ++i) {
			reordenedTable[i][columnIndex] = column[i];
		}
	});

	return (
		<VerticalTableContainer style={baseStyle}>
			<thead>
				<tr>
					{reordenedTable[0].map((content, index) => (
						<th
							style={{
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
