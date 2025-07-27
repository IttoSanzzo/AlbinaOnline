import { StyledLink } from "@/components/(Design)";
import {
	Notion2Columns,
	NotionBox,
	NotionHeader,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";
import { SpellProperties } from "@/libs/stp@types";

interface SpellPropertiesDisplayProps {
	spellProperties?: SpellProperties;
	spellDomains: string[];
	magicAttributes: string[];
	spellLevel: number;
}

export default function SpellPropertiesDisplay({
	spellProperties,
	spellDomains,
	magicAttributes,
	spellLevel,
}: SpellPropertiesDisplayProps) {
	if (!spellProperties) return <></>;
	if (magicAttributes.length === 0) magicAttributes[0] = "Nenhum";

	return (
		<NotionBox
			backgroundColor="gray"
			withoutPadding>
			<NotionHeader
				headerType="h2"
				textAlign="center"
				textColor="orange"
				children={`¤ Feitiço Nível ${spellLevel} ¤`}
			/>
			<NotionBox
				backgroundColor="darkGray"
				withoutBorder>
				<Notion2Columns
					colum1={
						<NotionTable
							textColor="gray"
							withHeaderColumn={false}
							withHeaderRow
							tableData={{
								tableLanes: [
									[
										<NotionText
											textColor="orange"
											children={"Domínios"}
										/>,
									],
									...spellDomains.map((spellDomain) => [
										<StyledLink
											href={`/spells/${spellDomain.toLowerCase()}`}
											title={spellDomain}
											textMode
										/>,
									]),
								],
							}}
						/>
					}
					colum2={
						<NotionTable
							textColor="gray"
							withHeaderColumn={false}
							withHeaderRow
							tableData={{
								tableLanes: [
									[
										<NotionText
											textColor="orange"
											children={`Atributos Mágicos`}
										/>,
									],
									...magicAttributes.map((magicAttribute) => [
										<NotionText>{magicAttribute}</NotionText>,
									]),
								],
							}}
						/>
					}
				/>
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
											children={spellProperties.components.mana}
										/>,
									],
									[
										<NotionText
											textColor="green"
											children="🧪Estamina"
										/>,
										<NotionText
											textColor="green"
											children={spellProperties.components.stamina}
										/>,
									],
									[
										<NotionText
											textColor="brown"
											children="🕰️Tempo"
										/>,
										<NotionText
											textColor="brown"
											children={spellProperties.components.time}
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
											children={spellProperties.components.duration}
										/>,
									],
									[
										<NotionText
											textColor="green"
											children="❇️Forma"
										/>,
										<NotionText
											textColor="green"
											children={spellProperties.components.form}
										/>,
									],
									[
										<NotionText
											textColor="orange"
											children="📏Alcance"
										/>,
										<NotionText
											textColor="orange"
											children={spellProperties.components.range}
										/>,
									],
									[
										<NotionText
											textColor="orange"
											children="📐Área"
										/>,
										<NotionText
											textColor="orange"
											children={spellProperties.components.area}
										/>,
									],
								],
							}}
						/>
					}
				/>
				{spellProperties.extras.length !== 0 && (
					<NotionTable
						withHeaderRow
						textColor="gray"
						fixedLinePositions={[1]}
						fixedLineWidths={[25]}
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
								...spellProperties.extras.map((extra) => [
									<NotionText>{`⦇ ${extra.key} ⦈`}</NotionText>,
									<NotionText>{`⪩ ${extra.value}`}</NotionText>,
								]),
							],
						}}
					/>
				)}
				{spellProperties.extras.length !== 0 && (
					<NotionTable
						withHeaderRow
						textColor="gray"
						fixedLinePositions={[1]}
						fixedLineWidths={[15]}
						tableData={{
							tableLanes: [
								[
									<NotionText
										textColor="orange"
										children="Linhas"
									/>,
									<NotionText
										textColor="orange"
										children="Cânticos"
										textAlign="flex-center"
										withBold
									/>,
								],
								...spellProperties.chants.map((chantLine, index) => [
									<NotionText>{`⦇Linha ${index}⦈`}</NotionText>,
									<NotionText>{chantLine}</NotionText>,
								]),
							],
						}}
					/>
				)}
			</NotionBox>
		</NotionBox>
	);
}
