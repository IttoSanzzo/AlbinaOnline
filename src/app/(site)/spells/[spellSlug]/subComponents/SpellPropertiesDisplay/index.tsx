import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { MagicAttribute, SpellProperties } from "@/libs/stp@types";

const defaultManaCostPerLevel = {
	0: 2,
	1: 3,
	2: 5,
	3: 8,
	4: 12,
	5: 17,
	6: 23,
	7: 30,
	8: 38,
	9: 49,
	10: 59,
	11: 70,
	12: 82,
};

interface SpellPropertiesDisplayProps {
	spellProperties?: SpellProperties;
	spellDomains: string[];
	magicAttributes: (keyof typeof MagicAttribute)[];
	spellLevel: number;
}
export default function SpellPropertiesDisplay({
	spellProperties,
	spellDomains,
	magicAttributes,
	spellLevel,
}: SpellPropertiesDisplayProps) {
	if (!spellProperties) return <></>;

	if (spellProperties.components.mana == "")
		spellProperties.components.mana = `${defaultManaCostPerLevel[spellLevel as keyof typeof defaultManaCostPerLevel]} (Default)`;

	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding>
			<UIBasics.Header
				headerType="h2"
				textAlign="center"
				textColor="orange"
				children={`¤ Feitiço Nível ${spellLevel} ¤`}
			/>
			<UIBasics.Box
				backgroundColor="darkGray"
				withoutBorder>
				<UIBasics.MultiColumn.Two
					colum1={
						<UIBasics.Table
							textColor="gray"
							withHeaderColumn={false}
							withHeaderRow
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											textColor="orange"
											children={"Domínios"}
										/>,
									],
									[
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												gap: "5px",
											}}>
											{...spellDomains.map((spellDomain) => [
												<StyledLink
													key={spellDomain}
													href={`/spells/${spellDomain.toLowerCase()}`}
													title={spellDomain}
													textMode
												/>,
											])}
										</div>,
									],
								],
							}}
						/>
					}
					colum2={
						<UIBasics.Table
							textColor="gray"
							withHeaderColumn={false}
							withHeaderRow
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											textColor="orange"
											children={`Atributos Mágicos`}
										/>,
									],
									[
										<UIBasics.Text
											style={{
												width: "100%",
											}}
											textAlign="center">
											{magicAttributes.length == 0
												? "Nenhum"
												: magicAttributes.join(", ")}
										</UIBasics.Text>,
									],
								],
							}}
						/>
					}
				/>
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
											children={spellProperties.components.mana}
										/>,
									],
									[
										<UIBasics.Text
											textColor="green"
											children="🧪Estamina"
										/>,
										<UIBasics.Text
											textColor="green"
											children={spellProperties.components.stamina}
										/>,
									],
									[
										<UIBasics.Text
											textColor="brown"
											children="🕰️Tempo"
										/>,
										<UIBasics.Text
											textColor="brown"
											children={spellProperties.components.time}
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
											children={spellProperties.components.duration}
										/>,
									],
									[
										<UIBasics.Text
											textColor="green"
											children="❇️Forma"
										/>,
										<UIBasics.Text
											textColor="green"
											children={spellProperties.components.form}
										/>,
									],
									[
										<UIBasics.Text
											textColor="orange"
											children="📏Alcance"
										/>,
										<UIBasics.Text
											textColor="orange"
											children={spellProperties.components.range}
										/>,
									],
									[
										<UIBasics.Text
											textColor="orange"
											children="📐Área"
										/>,
										<UIBasics.Text
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
								...spellProperties.extras.map((extra) => [
									<UIBasics.Text>{`${extra.key}`}</UIBasics.Text>,
									<UIBasics.Text>{extra.value}</UIBasics.Text>,
								]),
							],
						}}
					/>
				)}
				{spellProperties.chants.length !== 0 && (
					<UIBasics.Table
						withHeaderRow
						textColor="gray"
						fixedLinePositions={[1]}
						fixedLineWidths={[15]}
						tableData={{
							tableLanes: [
								[
									<UIBasics.Text
										textColor="orange"
										children="Linhas"
									/>,
									<UIBasics.Text
										textColor="orange"
										children="Cânticos"
										textAlign="flex-center"
										withBold
									/>,
								],
								...spellProperties.chants.map((chantLine, index) => [
									<UIBasics.Text>{`⦇Linha ${index + 1}⦈`}</UIBasics.Text>,
									<UIBasics.Text>{chantLine}</UIBasics.Text>,
								]),
							],
						}}
					/>
				)}
			</UIBasics.Box>
		</UIBasics.Box>
	);
}
