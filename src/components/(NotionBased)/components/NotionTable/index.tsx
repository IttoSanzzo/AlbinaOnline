import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionTextColor,
} from "../../index";
import {
	NotionVerticalTableContainer,
	NotionHorizontalTableContainer,
} from "./styledElements";
import { CSSProperties, ReactNode } from "react";

export interface NotionTableData {
	tableLanes: Array<ReactNode[]>;
}

interface NotionTableProps extends NotionPropsColor {
	tableData: NotionTableData;
	direction?: "row" | "column";
	fixedLinePosition?: number;
	fixedLineSize?: number;
	withHeaderRow?: boolean;
	withHeaderColumn?: boolean;
}

export function NotionTable({
	tableData: { tableLanes },
	direction = "row",
	fixedLinePosition = 1,
	fixedLineSize,
	withHeaderRow = false,
	withHeaderColumn = true,
	textColor,
	backgroundColor,
}: NotionTableProps) {
	const baseStyle: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
	};

	if (direction === "row") {
		return (
			<NotionHorizontalTableContainer style={baseStyle}>
				<tbody>
					{tableLanes.map((row, laneIndex) => (
						<tr key={laneIndex}>
							{row.map((column, rowIndex) => {
								const contentStyle = {
									...(fixedLineSize &&
										rowIndex === fixedLinePosition - 1 && {
											width: `${fixedLineSize}%`,
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
			</NotionHorizontalTableContainer>
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
		<NotionVerticalTableContainer style={baseStyle}>
			<thead>
				<tr>
					{reordenedTable[0].map((content, index) => (
						<th key={index}>{content}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{reordenedTable.slice(1).map((column, index) => (
					<tr key={index}>
						{column.map((columnContent, index) => (
							<td key={index}>{columnContent}</td>
						))}
					</tr>
				))}
			</tbody>
		</NotionVerticalTableContainer>
	);
}
