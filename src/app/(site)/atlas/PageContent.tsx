import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

export async function PageContent() {
	return (
		<UIBasics.List.Grid
			direction="row"
			backgroundColor="darkGray">
			<StyledLinkCard
				artworkUrl={getAlbinaApiFullAddress("/favicon/atlas/orvanis")}
				href="/atlas/orvanis"
				title="Orvanis"
				titleAlwaysOpen
			/>
		</UIBasics.List.Grid>
	);
}
