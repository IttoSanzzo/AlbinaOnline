import { Guid, RaceData, skillNames } from "@/libs/stp@types";
import { NotionGridList } from "@/components/(UTILS)";
import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { StyledLinklikeButton } from "@/components/(Design)";
import { Dialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { insertSorted } from "@/utils/Data";
import { NotionToggleHeader } from "@/components/(NotionBased)";

// const ButtonContainer = newStyledElement.div(styles.buttonContainer);

interface RaceSelectionCoreProps {
	characterId: Guid;
	raceState: RaceData;
	setRaceState: Dispatch<SetStateAction<RaceData>>;
}
export function RaceSelectionCore({
	characterId,
	raceState,
	setRaceState,
}: RaceSelectionCoreProps) {
	const [allRaces, setAllRaces] = useState<RaceData[]>([]);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress("/races"), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllRaces(await response.json());
		});
	}, []);

	if (allRaces.length == 0) return null;
	const otherRaces: RaceData[] = allRaces
		.filter((race) => race.id != raceState.id)
		.sort((r1, r2) => {
			return r1.name.localeCompare(r2.name);
		});

	async function handleRaceChange(race: RaceData) {
		const body = {
			raceId: race.id,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/race`),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) return;
		setRaceState(race);
	}

	return (
		<NotionGridList
			columnWidth={300}
			direction="column"
			backgroundColor="gray"
			children={otherRaces.map((race) => {
				return (
					<Dialog.Close
						key={race.id}
						asChild>
						<StyledLinklikeButton
							title={race.name}
							icon={race.iconUrl}
							onClick={() => handleRaceChange(race)}
						/>
					</Dialog.Close>
				);
			})}
		/>
	);
}
