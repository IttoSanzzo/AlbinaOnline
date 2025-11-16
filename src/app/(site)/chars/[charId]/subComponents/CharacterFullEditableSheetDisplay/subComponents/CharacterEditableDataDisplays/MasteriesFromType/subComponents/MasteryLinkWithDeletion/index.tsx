import { StyledLinkWithButton } from "@/components/(Design)/components/StyledLinkWithButton";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useContext } from "react";
import { MasteriesContext } from "../../../../CharacterEditableSheetContextProviders";
import { Guid } from "@/libs/stp@types";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../..";

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
			icon={`${getAlbinaApiFullAddress()}/favicon/maestrias/${slug}`}
			buttonIcon={{ name: "Trash", color: "red" }}
			onClick={async () => {
				const body = { masteryId: masteryId };
				const toastId = toast.loading(CharToastMessage.loading);
				const response = await authenticatedFetchAsync(
					`${getAlbinaApiFullAddress()}/chars/${characterId}/masteries`,
					{
						method: "DELETE",
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
					return state.filter((mastery) => mastery.masteryId != masteryId);
				});
			}}
		/>
	);
}
