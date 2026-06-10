import { StyledLinkWithButton } from "@/components/(Design)/components/StyledLinkWithButton";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useContext } from "react";
import { MasteriesContext } from "../../../../CharacterEditableSheetContextProviders";
import { CharacterMasteryExpanded } from "@/libs/stp@types";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../..";
import { EditMasteryNotesButton } from "../EditMasteryNotesButton";

interface MasteryLinkWithDeletionProps {
	mastery: CharacterMasteryExpanded;
}
export function MasteryLinkWithDeletion({
	mastery,
}: MasteryLinkWithDeletionProps) {
	const { setCharacterMasteries } = useContext(MasteriesContext);

	return (
		<StyledLinkWithButton
			style={{ marginRight: "2px" }}
			linkStyle={{
				height: "28px",
				overflow: "hidden",
			}}
			titleStyle={{
				textAlign: "left",
				minWidth: "400px",
			}}
			title={mastery.mastery.name}
			href={`/maestrias/${mastery.mastery.slug}`}
			icon={getAlbinaApiFullAddress(
				`/favicon/masteries/${mastery.mastery.slug}`,
			)}
			buttonIcon={{ name: "Trash", color: "red" }}
			onClick={async () => {
				const body = { masteryId: mastery.masteryId };
				const toastId = toast.loading(CharToastMessage.loading);
				const response = await authenticatedFetchAsync(
					`${getAlbinaApiFullAddress()}/chars/${mastery.characterId}/masteries`,
					{
						method: "DELETE",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
				if (!response.ok) {
					toast.error(CharToastMessage.error, { id: toastId });
					return;
				}
				toast.success(CharToastMessage.success, { id: toastId });
				setCharacterMasteries((state) => {
					return state.filter(
						(masteryF) => masteryF.masteryId != mastery.masteryId,
					);
				});
			}}>
			<EditMasteryNotesButton
				characterId={mastery.characterId}
				masteryId={mastery.masteryId}
				notes={mastery.notes}
			/>
		</StyledLinkWithButton>
	);
}
