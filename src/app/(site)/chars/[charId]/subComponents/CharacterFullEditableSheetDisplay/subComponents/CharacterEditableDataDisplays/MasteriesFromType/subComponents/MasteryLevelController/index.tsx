import { SideActionNumberInputButtons } from "@/components/(UTILS)";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useContext } from "react";
import { MasteriesContext } from "../../../../CharacterEditableSheetContextProviders";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";

interface MasteryLevelControllerProps {
	level: number;
	characterId: string;
	masteryId: string;
}
export function MasteryLevelController({
	level,
	characterId,
	masteryId,
}: MasteryLevelControllerProps) {
	const { setCharacterMasteries } = useContext(MasteriesContext);

	async function handleMasteryLevelChange(value: number) {
		const body = {
			level: value,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/masteries/${masteryId}`),
			{
				method: "PATCH",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) return;
		setCharacterMasteries((state) => {
			return state.map((mastery) =>
				mastery.masteryId === masteryId ? { ...mastery, level: value } : mastery
			);
		});
	}
	return (
		<SideActionNumberInputButtons
			key={masteryId}
			min={0}
			max={10}
			defaultValue={level}
			action={handleMasteryLevelChange}
		/>
	);
}
