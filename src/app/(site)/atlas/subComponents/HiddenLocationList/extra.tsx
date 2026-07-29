"use client";

import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { LocationData } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useEffect, useState } from "react";

export function HiddenLocationListExtra() {
	const [locations, setLocations] = useState<LocationData[]>([]);

	useEffect(() => {
		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress("/atlas/include-hidden"),
			);
			if (!response.ok) return;
			const data: LocationData[] = await response.json();
			setLocations(data.filter((location) => location.isHidden == true));
		})();
	}, [setLocations]);

	if (locations.length == 0) return null;
	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding>
			<UIBasics.Header
				textColor="purple"
				textAlign="center"
				backgroundColor="darkGray">
				Não Listados
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
	);
}
