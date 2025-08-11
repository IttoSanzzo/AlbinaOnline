import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterMiscMetrics } from "@/libs/stp@types";

interface AttributesDisplayProps {
	miscMetrics: CharacterMiscMetrics;
}
export function AttributesDisplay({ miscMetrics }: AttributesDisplayProps) {
	return (
		<UIBasics.Table
			direction="column"
			withoutMargin
			withoutBorderRadius
			tableData={{
				tableLanes: [
					[
						<UIBasics.Text
							display="block"
							textAlign="center"
							textColor="gray"
							children="Atributos Mágicos"
						/>,
						miscMetrics.magicAttributes.length > 0 ? (
							<UIBasics.List.Grid
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
