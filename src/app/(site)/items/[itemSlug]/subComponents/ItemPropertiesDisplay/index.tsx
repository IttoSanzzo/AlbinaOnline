import {
	Notion2Columns,
	NotionBox,
	NotionHeader,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";
import { ItemProperties } from "@/libs/stp@types";

interface ItemPropertiesDisplayProps {
	itemProperties?: ItemProperties;
}

export default function ItemPropertiesDisplay({
	itemProperties,
}: ItemPropertiesDisplayProps) {
	if (!itemProperties) return <></>;
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
				<NotionTable
					direction="column"
					tableData={{
						tableLanes: [
							[
								<NotionText
									textColor="purple"
									children="📥Slot"
								/>,
								<NotionText
									textColor="gray"
									textAlign="flex-center"
									children={itemProperties.slot}
								/>,
							],
							[
								<NotionText
									textColor="purple"
									children="🪷Atributo do Item"
								/>,
								<NotionText
									textColor="gray"
									textAlign="flex-center"
									children={itemProperties.attribute}
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
						<Notion2Columns
							colum1={
								<NotionTable
									tableData={{
										tableLanes: [
											[
												<NotionText
													textColor="red"
													children="🗡️Dano"
												/>,
												<NotionText
													textColor="default"
													children={itemProperties.stats.damage}
												/>,
											],
											[
												<NotionText
													textColor="green"
													children="🎯Acerto"
												/>,
												<NotionText
													textColor="default"
													children={itemProperties.stats.accuracy}
												/>,
											],
											[
												<NotionText
													textColor="orange"
													children="🛡️Defesa"
												/>,
												<NotionText
													textColor="default"
													children={itemProperties.stats.defense}
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
													textColor="gray"
													children="🗡️Tipo de Dano"
												/>,
												<NotionText
													textColor="gray"
													children={itemProperties.stats.damageType}
												/>,
											],
											[
												<NotionText
													textColor="gray"
													children="📐Alcance"
												/>,
												<NotionText
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
								...itemProperties.extras.map((extra) => [
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
