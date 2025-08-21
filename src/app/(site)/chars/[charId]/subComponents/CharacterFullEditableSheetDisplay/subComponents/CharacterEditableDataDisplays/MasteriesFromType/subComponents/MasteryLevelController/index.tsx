import { SideActionNumberInputButtons } from "@/components/(UTILS)";
import { Guid } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useContext } from "react";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../..";
import { MasteriesContext } from "../../../../CharacterEditableSheetContextProviders";

interface MasteryLevelControllerProps {
	level: number;
	characterId: Guid;
	masteryId: Guid;
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
		const toastId = toast.loading(CharToastMessage.loading);
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
		if (!response.ok) {
			toast.error(CharToastMessage.error, { id: toastId });
			return;
		}
		toast.success(CharToastMessage.success, { id: toastId });
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
