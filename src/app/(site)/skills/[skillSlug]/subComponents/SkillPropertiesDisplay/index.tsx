import { UIBasics } from "@/components/(UIBasics)";
import { SkillProperties } from "@/libs/stp@types";

interface SkillPropertiesDisplayProps {
	skillProperties?: SkillProperties;
}

export default function SkillPropertiesDisplay({
	skillProperties,
}: SkillPropertiesDisplayProps) {
	if (!skillProperties) return <></>;
	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding>
			<UIBasics.Header
				headerType="h2"
				textAlign="center"
				textColor="orange"
				children={"¤ Propriedades ¤"}
			/>
			<UIBasics.Box
				backgroundColor="darkGray"
				withoutBorder>
				<UIBasics.MultiColumn.Two
					colum1={
						<UIBasics.Table
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											textColor="blue"
											children="💠Mana"
										/>,
										<UIBasics.Text
											textColor="blue"
											children={skillProperties.components.mana}
										/>,
									],
									[
										<UIBasics.Text
											textColor="green"
											children="🧪Estamina"
										/>,
										<UIBasics.Text
											textColor="green"
											children={skillProperties.components.stamina}
										/>,
									],
									[
										<UIBasics.Text
											textColor="brown"
											children="🕰️Tempo"
										/>,
										<UIBasics.Text
											textColor="brown"
											children={skillProperties.components.time}
										/>,
									],
								],
							}}
						/>
					}
					colum2={
						<UIBasics.Table
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											textColor="blue"
											children="⏳Duração"
										/>,
										<UIBasics.Text
											textColor="blue"
											children={skillProperties.components.duration}
										/>,
									],
									[
										<UIBasics.Text
											textColor="green"
											children="❇️Forma"
										/>,
										<UIBasics.Text
											textColor="green"
											children={skillProperties.components.form}
										/>,
									],
									[
										<UIBasics.Text
											textColor="orange"
											children="📏Alcance"
										/>,
										<UIBasics.Text
											textColor="orange"
											children={skillProperties.components.range}
										/>,
									],
									[
										<UIBasics.Text
											textColor="orange"
											children="📐Área"
										/>,
										<UIBasics.Text
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
					<UIBasics.Table
						withHeaderRow
						textColor="gray"
						fixedLinePositions={[1]}
						fixedLineWidths={[25]}
						tableData={{
							tableLanes: [
								[
									<UIBasics.Text
										textColor="orange"
										children="Extras"
									/>,
									<UIBasics.Text
										textColor="orange"
										children="Descrição"
										textAlign="flex-center"
										withBold
									/>,
								],
								...skillProperties.extras.map((extra) => [
									<UIBasics.Text>{`⦇ ${extra.key} ⦈`}</UIBasics.Text>,
									<UIBasics.Text>{`⪩ ${extra.value}`}</UIBasics.Text>,
								]),
							],
						}}
					/>
				)}
			</UIBasics.Box>
		</UIBasics.Box>
	);
}
