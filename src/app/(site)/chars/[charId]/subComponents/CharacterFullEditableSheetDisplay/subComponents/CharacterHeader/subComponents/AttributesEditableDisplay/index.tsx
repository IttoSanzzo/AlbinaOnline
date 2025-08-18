import { Dispatch, SetStateAction, useContext } from "react";
import { MiscMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/MiscMetrics";
import { StyledLinkWithButton } from "@/components/(Design)";
import { CharacterMiscMetrics, Guid, MagicAttribute } from "@/libs/stp@types";
import { CharacterIdContext } from "../../../CharacterEditableSheetContextProviders";
import { AddAttributeButton } from "./subComponents/AddAttributeButton";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../../CharacterEditableDataDisplays";

async function handleRemoveAttribute(
	characterId: Guid,
	magicAttribute: keyof typeof MagicAttribute,
	miscMetrics: CharacterMiscMetrics,
	setMiscMetrics: Dispatch<SetStateAction<CharacterMiscMetrics>>
) {
	const body = {
		...miscMetrics,
		magicAttributes: miscMetrics.magicAttributes.filter(
			(characterMagicAttribute) => characterMagicAttribute != magicAttribute
		),
	};
	const toastId = toast.loading(CharToastMessage.loading);
	const response = await authenticatedFetchAsync(
		getAlbinaApiAddress(`/chars/${characterId}/misc-metrics`),
		{
			method: "PUT",
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
	setMiscMetrics(body);
}

interface AttributesEditableDisplayProps {}
export function AttributesEditableDisplay({}: AttributesEditableDisplayProps) {
	const { miscMetrics, setMiscMetrics } = useContext(MiscMetricsContext);
	const { characterId } = useContext(CharacterIdContext);

	return (
		<UIBasics.Table
			direction="column"
			withoutMargin
			withoutBorderRadius
			tableData={{
				tableLanes: [
					[
						<div style={{ position: "relative" }}>
							<AddAttributeButton
								characterId={characterId}
								alreadyHasAttributes={miscMetrics.magicAttributes}
								miscMetrics={miscMetrics}
								setMiscMetrics={setMiscMetrics}
							/>
							<UIBasics.Text
								display="block"
								textAlign="center"
								textColor="gray"
								children="Atributos Mágicos"
							/>
						</div>,
						miscMetrics.magicAttributes.length > 0 ? (
							<UIBasics.List.Grid
								columnWidth={100}
								withoutBorder
								withoutMargin
								withoutPadding
								children={miscMetrics.magicAttributes.map((magicAttribute) => (
									<StyledLinkWithButton
										key={magicAttribute}
										buttonIcon={{ name: "Trash", color: "red" }}
										href="/spells/"
										title={String(magicAttribute)}
										onClick={async () =>
											await handleRemoveAttribute(
												characterId,
												magicAttribute,
												miscMetrics,
												setMiscMetrics
											)
										}
									/>
								))}
							/>
						) : (
							<UIBasics.Text
								display="block"
								textAlign="center"
								textColor="gray"
								children="Nenhum atributo"
							/>
						),
					],
				],
			}}
		/>
	);
}
