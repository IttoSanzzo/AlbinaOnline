import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { Dispatch, SetStateAction, useContext } from "react";
import { MiscMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/MiscMetrics";
import { StyledLinkWithButton } from "@/components/(Design)";
import { CharacterMiscMetrics, Guid, MagicAttribute } from "@/libs/stp@types";
import { CharacterIdContext } from "../../../CharacterEditableSheetContextProviders";
import { AddAttributeButton } from "./subComponents/AddAttributeButton";
import { NotionGridList } from "@/components/(UTILS)";

async function handleRemoveAttribute(
	characterId: Guid,
	magicAttribute: keyof typeof MagicAttribute,
	setMiscMetrics: Dispatch<SetStateAction<CharacterMiscMetrics>>
) {
	console.log(magicAttribute);
}

interface AttributesEditableDisplayProps {}
export function AttributesEditableDisplay({}: AttributesEditableDisplayProps) {
	const { miscMetrics, setMiscMetrics } = useContext(MiscMetricsContext);
	const { characterId } = useContext(CharacterIdContext);

	return (
		<NotionTable
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
							<NotionText
								display="block"
								textAlign="center"
								textColor="gray"
								children="Atributos"
							/>
						</div>,
						miscMetrics.magicAttributes.length > 0 ? (
							<NotionGridList
								withoutBorder
								withoutMargin
								withoutPadding
								children={miscMetrics.magicAttributes.map((magicAttribute) => (
									<StyledLinkWithButton
										buttonIcon={{ name: "Trash", color: "red" }}
										href="/spells/"
										title={String(magicAttribute)}
										onClick={async () =>
											await handleRemoveAttribute(
												characterId,
												magicAttribute,
												setMiscMetrics
											)
										}
									/>
								))}
							/>
						) : (
							<NotionText
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
