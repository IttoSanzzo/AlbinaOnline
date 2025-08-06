import { StyledLinkWithButton } from "@/components/(Design)/components/StyledLinkWithButton";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useContext } from "react";
import { MasteriesContext } from "../../../../CharacterEditableSheetContextProviders";
import { Guid } from "@/libs/stp@types";

interface MasteryLinkWithDeletionProps {
	characterId: Guid;
	masteryId: Guid;
	name: string;
	slug: string;
}
export function MasteryLinkWithDeletion({
	characterId,
	masteryId,
	name,
	slug,
}: MasteryLinkWithDeletionProps) {
	const { setCharacterMasteries } = useContext(MasteriesContext);

	return (
		<StyledLinkWithButton
			title={name}
			href={`/maestrias/${slug}`}
			icon={`${getAlbinaApiAddress()}/favicon/maestrias/${slug}`}
			buttonIcon={{ name: "Trash", color: "red" }}
			onClick={async () => {
				const body = { masteryId: masteryId };
				const response = await authenticatedFetchAsync(
					`${getAlbinaApiAddress()}/chars/${characterId}/masteries`,
					{
						method: "DELETE",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				if (!response.ok) return;
				setCharacterMasteries((state) => {
					return state.filter((mastery) => mastery.masteryId != masteryId);
				});
			}}
		/>
	);
}
