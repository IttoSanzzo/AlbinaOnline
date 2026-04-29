import { UIBasics } from "@/components/(UIBasics)";
import { ItemProperties, ItemSlotTypeName } from "@/libs/stp@types";

interface ItemPropertiesDisplayProps {
	itemProperties?: ItemProperties;
}
export default function ItemPropertiesDisplay({
	itemProperties,
}: ItemPropertiesDisplayProps) {
	if (!itemProperties) return <></>;
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
				<UIBasics.Table
					direction="column"
					tableData={{
						tableLanes: [
							[
								<UIBasics.Text
									textColor="purple"
									children="📥Slot"
								/>,
								<UIBasics.Text
									textColor="gray"
									textAlign="flex-center"
									children={itemProperties.compatibleSlots
										.map((slot) => ItemSlotTypeName[slot])
										.join(", ")}
								/>,
							],
							[
								<UIBasics.Text
									textColor="purple"
									children="🪷Atributo do Item"
								/>,
								<UIBasics.Text
									textColor="gray"
									textAlign="flex-center"
									children={itemProperties.magicAttributes.join(", ")}
								/>,
							],
							[
								<UIBasics.Text
									textColor="purple"
									children="⚖️Peso"
								/>,
								<UIBasics.Text
									textColor="gray"
									textAlign="flex-center"
									children={`${itemProperties.weight / 1000} Kgs`}
								/>,
							],
						],
					}}
				/>
				{itemProperties.stats &&
					(itemProperties.stats.accuracy != "" ||
						itemProperties.stats.damage != "" ||
						itemProperties.stats.damageType != "" ||
						itemProperties.stats.defense != "" ||
						itemProperties.stats.range != "") && (
						<UIBasics.MultiColumn.Two
							colum1={
								<UIBasics.Table
									tableData={{
										tableLanes: [
											[
												<UIBasics.Text
													textColor="red"
													children="🗡️Dano"
												/>,
												<UIBasics.Text
													textColor="default"
													children={itemProperties.stats.damage}
												/>,
											],
											[
												<UIBasics.Text
													textColor="green"
													children="🎯Acerto"
												/>,
												<UIBasics.Text
													textColor="default"
													children={itemProperties.stats.accuracy}
												/>,
											],
											[
												<UIBasics.Text
													textColor="orange"
													children="🛡️Defesa"
												/>,
												<UIBasics.Text
													textColor="default"
													children={itemProperties.stats.defense}
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
													textColor="gray"
													children="🗡️Tipo de Dano"
												/>,
												<UIBasics.Text
													textColor="gray"
													children={itemProperties.stats.damageType}
												/>,
											],
											[
												<UIBasics.Text
													textColor="gray"
													children="📐Alcance"
												/>,
												<UIBasics.Text
													textColor="gray"
													children={itemProperties.stats.range}
												/>,
											],
										],
									}}
								/>
							}
						/>
					)}
				{itemProperties.extras.length !== 0 && (
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
								...itemProperties.extras.map((extra) => [
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
