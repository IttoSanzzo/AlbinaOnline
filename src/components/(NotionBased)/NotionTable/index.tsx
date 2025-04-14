import { NotionPropsColor } from "@/utils/NotionBasedUtils";
import {
	NotionVerticalTableContainer,
	NotionHorizontalTableContainer,
} from "./styledElements";
import { CSSProperties, ReactNode } from "react";

interface NotionTableData {
	rows: [colums: ReactNode[]];
}

interface NotionTableProps extends NotionPropsColor {
	tableData: NotionTableData;
	direction?: "row" | "colum";
	fixedLinePosition?: number;
	fixedLineSize?: number;
}

export default function NotionTable({
	tableData,
	direction = "row",
	fixedLinePosition = 1,
	fixedLineSize,
	textColor,
	backgroundColor,
}: NotionTableProps) {
	const baseStyle: CSSProperties = {
		...(textColor && { color: textColor }),
		...(backgroundColor && { backgroundColor: backgroundColor }),
	};

	if (direction === "row") {
		return (
			<NotionHorizontalTableContainer style={baseStyle}>
				<tbody>
					{tableData.rows.map((row, index) => (
						<tr key={index}>
							{row.map((colum, index) => {
								const contentStyle =
									fixedLineSize && index === fixedLinePosition - 1
										? { width: `${fixedLineSize}%` }
										: {};
								if (index === 0) {
									return (
										<th
											key={index}
											style={contentStyle}>
											{colum}
										</th>
									);
								}
								return (
									<td
										key={index}
										style={contentStyle}>
										{colum}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</NotionHorizontalTableContainer>
		);
	}
	return (
		<NotionVerticalTableContainer style={baseStyle}>
			<thead>
				<tr>
					<th>Name 1</th>
					<th>Name 2</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Itto</td>
					<td>Sanzzo</td>
				</tr>
				<tr>
					<td>Envest</td>
					<td>Drean</td>
				</tr>
			</tbody>
		</NotionVerticalTableContainer>
	);
}
