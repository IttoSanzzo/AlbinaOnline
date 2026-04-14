import { useContext, useLayoutEffect } from "react";
import { CoreMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import { MiscMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/MiscMetrics";
import { ItemsContext } from "../../../CharacterEditableSheetContextProviders/contexts/Items";
import { CharacterItemStackExpanded, Guid } from "@/libs/stp@types";
import { UIBasics } from "@/components/(UIBasics)";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useCharacterUpdated } from "@/libs/stp@hooks";

function calcTotalWeight(characterItems: CharacterItemStackExpanded[]) {
	return (
		characterItems.reduce(
			(acc, current) => acc + current.amount * current.item.properties.weight,
			0,
		) / 1000
	);
}

interface MiscsTableProps {
	characterId: Guid;
}
export function MiscsTable({ characterId }: MiscsTableProps) {
	const { coreMetrics } = useContext(CoreMetricsContext);
	const { miscMetrics } = useContext(MiscMetricsContext);
	const { characterItems, setCharacterItems } = useContext(ItemsContext);

	async function loadItems(): Promise<boolean> {
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/items`),
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) return false;
		const data: CharacterItemStackExpanded[] = await response.json();
		const orderedData = data.sort((a, b) => {
			const nameCompare = a.item.name.localeCompare(b.item.name);
			if (nameCompare !== 0) return nameCompare;
			return a.amount - b.amount;
		});
		setCharacterItems(orderedData);
		return true;
	}

	useLayoutEffect(() => {
		loadItems();
	}, [characterId]);
	useCharacterUpdated(characterId, async () => {
		return await loadItems();
	});

	return (
		<UIBasics.Table
			fixedLinePositions={[1, 3]}
			fixedLineWidths={[28, 20]}
			withHeaderColumn={false}
			columnBackgroundColors={["darkGray", undefined, "darkGray"]}
			tableData={{
				tableLanes: [
					[
						<UIBasics.Text
							textColor="gray"
							children={"Iniciativa"}
						/>,
						<UIBasics.Text
							textColor="gray"
							display="block"
							textAlign="center"
							children={String(coreMetrics.initiative)}
						/>,
						<UIBasics.Text
							textColor="gray"
							children={"Carga"}
						/>,
						<UIBasics.Text
							textColor="gray"
							display="block"
							textAlign="center"
							children={`${calcTotalWeight(characterItems)}/${
								miscMetrics.carryCapacity
							}Kgs`}
						/>,
					],
					[
						<UIBasics.Text
							textColor="gray"
							children={"C.A."}
						/>,
						<UIBasics.Text
							textColor="gray"
							display="block"
							textAlign="center"
							children={String(coreMetrics.armorClass)}
						/>,
					],
					[
						<UIBasics.Text
							textColor="gray"
							children={"Movimento"}
						/>,
						<UIBasics.Text
							textColor="gray"
							display="block"
							textAlign="center"
							children={`${coreMetrics.speedStats.walkSpeed}/${coreMetrics.speedStats.combatSpeed}/${coreMetrics.speedStats.swimSpeed}/${coreMetrics.speedStats.flySpeed}`}
						/>,
					],
				],
			}}
		/>
	);
}
