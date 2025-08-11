import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
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
		<UIBasics.Text
			textColor="gray"
			children="Nome"
		/>,
		<UIBasics.Text
			textColor="gray"
			textAlign="center"
			display="block"
			children="Quant."
		/>,
		<UIBasics.Text
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
				<UIBasics.Text
					textColor="orange"
					children="-"
				/>,
				<UIBasics.Text
					textColor="orange"
					textAlign="center"
					display="block"
					children="-"
				/>,
				<UIBasics.Text
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
			<UIBasics.Text
				textColor="gray"
				children="Nome"
			/>,
			<UIBasics.Text
				textColor="gray"
				textAlign="center"
				display="block"
				children="Quant."
			/>,
			<UIBasics.Text
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
			<UIBasics.Text
				textAlign="center"
				display="block"
				children={characterItem.amount.toString()}
			/>,
			<UIBasics.Text
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
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Items"
			memoryId={`${characterId}-Items`}>
			<div style={{ position: "relative" }}>
				<UIBasics.Table
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
		</UIBasics.ToggleHeader>
	);
}
