import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { TraitData } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";

interface RacialTraitLinkProps {
	traitSlug: string;
}
export async function RacialTraitLink({ traitSlug }: RacialTraitLinkProps) {
	const response = await fetch(getAlbinaApiAddress(`/traits/${traitSlug}`), {
		method: "GET",
		cache: getCacheMode(),
	});
	if (!response.ok) {
		return (
			<StyledLink
				href={`/tracos/${traitSlug}`}
				title={`FAILED: ${traitSlug}`}
				icon={getAlbinaApiAddress(`/favicon/not-found`)}
			/>
		);
	}
	const data: TraitData = await response.json();
	return (
		<StyledLink
			href={`/tracos/${traitSlug}`}
			title={data.name}
			icon={data.iconUrl}
		/>
	);
}

interface RacialTraitsGridDisplayProps {
	traitSlugs: string[];
}
export async function RacialTraitsGridDisplay({
	traitSlugs,
}: RacialTraitsGridDisplayProps) {
	return (
		<UIBasics.List.Grid
			children={traitSlugs.map((traitSlug) => (
				<RacialTraitLink
					key={traitSlug}
					traitSlug={traitSlug}
				/>
			))}
		/>
	);
}
