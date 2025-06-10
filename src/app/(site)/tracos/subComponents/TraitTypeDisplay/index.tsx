import { StyledLink } from "@/components/(Design)";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";
import { TraitData } from "@/libs/stp@types";

interface TraitTypeDisplayProps {
	allTraits: TraitData[];
	type: string;
	subTypesOrder?: string[];
	title: string;
}

export default function TraitTypeDisplay({
	allTraits,
	type,
	subTypesOrder,
	title,
}: TraitTypeDisplayProps) {
	const allTraitsFromThisType = allTraits.filter(
		(trait) => trait.type === type
	);

	if (!subTypesOrder)
		return (
			<NotionBox
				backgroundColor="gray"
				withoutPadding>
				<NotionHeader
					textAlign="center"
					children={title}
				/>
				<NotionGridList
					backgroundColor="purple"
					children={allTraitsFromThisType.map((trait) => {
						return (
							<StyledLink
								key={trait.id}
								title={trait.name}
								href={`tracos/${trait.slug}`}
								icon={trait.iconUrl}
							/>
						);
					})}
				/>
			</NotionBox>
		);
	const allTraitsFromThisTypeOrdened: TraitData[] = [];
	subTypesOrder.forEach((subType) => {
		allTraitsFromThisType.forEach((trait) => {
			if (trait.subType === subType) allTraitsFromThisTypeOrdened.push(trait);
		});
	});

	return (
		<NotionBox
			backgroundColor="gray"
			withoutPadding>
			<NotionHeader
				textAlign="center"
				children={title}
			/>
			<NotionGridList
				backgroundColor="purple"
				children={allTraitsFromThisTypeOrdened.map((trait) => {
					return (
						<StyledLink
							key={trait.id}
							title={trait.name}
							href={`traits/${trait.slug}`}
							icon={trait.iconUrl}
						/>
					);
				})}
			/>
		</NotionBox>
	);
}
