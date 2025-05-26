import {
	Notion2Columns,
	NotionBox,
	NotionHeader,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";
import { SkillProperties } from "@/libs/stp@types";

interface SkillPropertiesDisplayProps {
	skillProperties?: SkillProperties;
}

export default function SkillPropertiesDisplay({
	skillProperties,
}: SkillPropertiesDisplayProps) {
	if (!skillProperties) return <></>;
	return (
		<NotionBox
			backgroundColor="gray"
			withoutPadding>
			<NotionHeader
				headerType="h2"
				textAlign="center"
				textColor="orange"
				children={"¤ Propriedades ¤"}
			/>
			<NotionBox
				backgroundColor="darkGray"
				withoutBorder>
				<Notion2Columns
					colum1={
						<NotionTable
							tableData={{
								tableLanes: [
									[
										<NotionText
											textColor="blue"
											children="💠Mana"
										/>,
										<NotionText
											textColor="blue"
											children={skillProperties.components.mana}
										/>,
									],
									[
										<NotionText
											textColor="green"
											children="🧪Estamina"
										/>,
										<NotionText
											textColor="green"
											children={skillProperties.components.stamina}
										/>,
									],
									[
										<NotionText
											textColor="brown"
											children="🕰️Tempo"
										/>,
										<NotionText
											textColor="brown"
											children={skillProperties.components.time}
										/>,
									],
								],
							}}
						/>
					}
					colum2={
						<NotionTable
							tableData={{
								tableLanes: [
									[
										<NotionText
											textColor="blue"
											children="⏳Duração"
										/>,
										<NotionText
											textColor="blue"
											children={skillProperties.components.duration}
										/>,
									],
									[
										<NotionText
											textColor="green"
											children="❇️Forma"
										/>,
										<NotionText
											textColor="green"
											children={skillProperties.components.form}
										/>,
									],
									[
										<NotionText
											textColor="orange"
											children="📏Alcance"
										/>,
										<NotionText
											textColor="orange"
											children={skillProperties.components.range}
										/>,
									],
									[
										<NotionText
											textColor="orange"
											children="📐Área"
										/>,
										<NotionText
											textColor="orange"
											children={skillProperties.components.area}
										/>,
									],
								],
							}}
						/>
					}
				/>
				{skillProperties.extras.length !== 0 && (
					<NotionTable
						withHeaderRow
						textColor="gray"
						fixedLineSize={25}
						tableData={{
							tableLanes: [
								[
									<NotionText
										textColor="orange"
										children="Extras"
									/>,
									<NotionText
										textColor="orange"
										children="Descrição"
										textAlign="flex-center"
										withBold
									/>,
								],
								...skillProperties.extras.map((extra) => [
									<NotionText>{`⦇ ${extra.key} ⦈`}</NotionText>,
									<NotionText>{`⪩ ${extra.value}`}</NotionText>,
								]),
							],
						}}
					/>
				)}
			</NotionBox>
		</NotionBox>
	);
}
