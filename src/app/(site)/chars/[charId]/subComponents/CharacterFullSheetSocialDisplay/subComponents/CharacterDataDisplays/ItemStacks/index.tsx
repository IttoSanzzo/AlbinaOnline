import { StyledLink } from "@/components/(Design)";
import {
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { CharacterItemStackExpanded, Guid } from "@/libs/stp@types";
import React from "react";

function calcTotalWeight(characterItems: CharacterItemStackExpanded[]) {
	return (
		characterItems.reduce(
			(acc, current) => acc + current.amount * current.item.properties.weight,
			0
		) / 1000
	);
}

function formTable(
	characterItems: CharacterItemStackExpanded[]
): React.JSX.Element[][] {
	const titleRow = [
		<NotionText
			textColor="gray"
			children="Nome"
		/>,
		<NotionText
			textColor="gray"
			textAlign="center"
			display="block"
			children="Quant."
		/>,
		<NotionText
			textColor="gray"
			textAlign="center"
			display="block"
			children="- Kg"
		/>,
	];
	if (characterItems.length == 0) {
		return [
			titleRow,
			[
				<NotionText
					textColor="orange"
					children="-"
				/>,
				<NotionText
					textColor="orange"
					textAlign="center"
					display="block"
					children="-"
				/>,
				<NotionText
					textColor="orange"
					textAlign="center"
					display="block"
					children="-"
				/>,
			],
		];
	}
	return [
		[
			<NotionText
				textColor="gray"
				children="Nome"
			/>,
			<NotionText
				textColor="gray"
				textAlign="center"
				display="block"
				children="Quant."
			/>,
			<NotionText
				textColor="gray"
				textAlign="center"
				display="block"
				children={`${calcTotalWeight(characterItems)} Kg`}
			/>,
		],
		...characterItems.map((characterItem) => [
			<StyledLink
				title={characterItem.item.name}
				icon={characterItem.item.iconUrl}
				href={`/items/${characterItem.item.slug}`}
			/>,
			<NotionText
				textAlign="center"
				display="block"
				children={characterItem.amount.toString()}
			/>,
			<NotionText
				textAlign="center"
				display="block"
				textColor="gray"
				children={`${
					(characterItem.amount * characterItem.item.properties.weight) / 1000
				}`}
			/>,
		]),
	];
}

interface CharacterItemStacksDisplayProps {
	characterId: Guid;
	characterItems: CharacterItemStackExpanded[];
}
export function CharacterItemStacksDisplay({
	characterId,
	characterItems,
}: CharacterItemStacksDisplayProps) {
	return (
		<NotionToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Items"
			memoryId={`${characterId}-Items`}>
			<div style={{ position: "relative" }}>
				<NotionTable
					fixedLineWidths={[30, 20]}
					fixedLinePositions={[2, 3]}
					style={{ margin: 0 }}
					withHeaderColumn={false}
					columnBackgroundColors={["gray"]}
					withHeaderRow
					tableData={{
						tableLanes: formTable(characterItems),
					}}
				/>
			</div>
		</NotionToggleHeader>
	);
}
