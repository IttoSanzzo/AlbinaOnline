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
}

export function NotionTable({
	tableData: { tableLanes },
	direction = "row",
	fixedLinePosition = 1,
	fixedLineSize,
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
					{tableLanes.map((row, index) => (
						<tr key={index}>
							{row.map((column, index) => {
								const contentStyle =
									fixedLineSize && index === fixedLinePosition - 1
										? { width: `${fixedLineSize}%` }
										: {};
								if (index === 0) {
									return (
										<th
											key={index}
											style={contentStyle}>
											{column}
										</th>
									);
								}
								return (
									<td
										key={index}
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

	const reordenedTable: Array<ReactNode[]> = Array.from(
		{ length: tableLanes.length },
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
