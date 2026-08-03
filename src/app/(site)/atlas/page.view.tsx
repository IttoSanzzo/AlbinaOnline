import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { LocationData } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { HiddenLocationList } from "./subComponents/HiddenLocationList";

export async function PageView() {
	const response = await fetch(getAlbinaApiFullAddress("/atlas"));
	const locations: LocationData[] = response.ok ? await response.json() : [];

	return (
		<>
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
			<HiddenLocationList />
			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.Header
					textColor="orange"
					textAlign="center"
					backgroundColor="darkGray">
					Todas
				</UIBasics.Header>
				<UIBasics.List.Grid
					withoutMargin
					direction="row"
					backgroundColor="darkGray">
					{locations.map((location) => (
						<StyledLinkCard
							key={location.id}
							artworkUrl={location.iconUrl}
							href={`/atlas/${location.slug}`}
							title={location.name}
							titleAlwaysOpen
						/>
					))}
				</UIBasics.List.Grid>
			</UIBasics.Box>
		</>
	);
}
