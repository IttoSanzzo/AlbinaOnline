import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { Notion2Columns } from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";

interface MasteriesAndTestsDrawerProps {
	characterId: string;
}
export function MasteriesAndTestsDrawer({
	characterId,
}: MasteriesAndTestsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Maestrias & Testes"
			memoryId={`${characterId}-MasteriesAndTests`}
			backgroundColor="blue">
			<Notion2Columns
				colum1={
					<CharacterEditableDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Proficiency"}
					/>
				}
				colum2={
					<CharacterEditableDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Craft"}
					/>
				}
			/>
			<Notion2Columns
				colum1={
					<CharacterEditableDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Expertise"}
					/>
				}
				colum2={
					<CharacterEditableDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Knowledge"}
					/>
				}
			/>
		</CharacterDrawerBaseHeader>
	);
}
