import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { StyledLink } from "@/components/(Design)";
import { CharacterMiscMetrics } from "@/libs/stp@types";
import { NotionGridList } from "@/components/(UTILS)";

interface AttributesDisplayProps {
	miscMetrics: CharacterMiscMetrics;
}
export function AttributesDisplay({ miscMetrics }: AttributesDisplayProps) {
	return (
		<NotionTable
			direction="column"
			withoutMargin
			withoutBorderRadius
			tableData={{
				tableLanes: [
					[
						<NotionText
							display="block"
							textAlign="center"
							textColor="gray"
							children="Atributos Mágicos"
						/>,
						miscMetrics.magicAttributes.length > 0 ? (
							<NotionGridList
								columnWidth={100}
								withoutBorder
								withoutMargin
								withoutPadding
								children={miscMetrics.magicAttributes.map((magicAttribute) => (
									<StyledLink
										key={magicAttribute}
										href="/spells/"
										title={String(magicAttribute)}
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
