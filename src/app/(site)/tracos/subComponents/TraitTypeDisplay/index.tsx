import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
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
			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.Header
					textAlign="center"
					children={title}
				/>
				<UIBasics.List.Grid
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
			</UIBasics.Box>
		);
	const allTraitsFromThisTypeOrdened: TraitData[] = [];
	subTypesOrder.forEach((subType) => {
		allTraitsFromThisType.forEach((trait) => {
			if (trait.subType === subType) allTraitsFromThisTypeOrdened.push(trait);
		});
	});

	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding>
			<UIBasics.Header
				textAlign="center"
				children={title}
			/>
			<UIBasics.List.Grid
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
		</UIBasics.Box>
	);
}
