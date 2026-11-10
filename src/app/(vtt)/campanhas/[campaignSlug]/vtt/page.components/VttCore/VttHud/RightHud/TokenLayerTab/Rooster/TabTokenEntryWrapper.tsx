import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./TabTokenEntryWrapper.module.css";
import { useVttTokenStore } from "../../../../../Stores/VttTokenStore";
import { Dispatch, SetStateAction, useEffect } from "react";
import { CharacterData, CreatureData, Guid, ItemData } from "@/libs/stp@types";
import { useVttContext } from "../../../../../Contexts/VttContextProvider";
import { VttToken } from "../../../../../Types/Classes/VttToken";
import { VttTokenTabEntryImageRenderer } from "../../../../VttBoard/TokenBoardLayer/VttTokenImageRenderer";
import { useVttThrottledViewportContext } from "../../../../../Contexts/VttThrottledViewportContext";
import { setVttElementHoverInteraction } from "../../../../../Utils/ElementDataAttributeUtils";
import { useAuthenticatedFetch } from "@/libs/stp@data-fetching";

interface TabTokenEntryWrapperProps {
	vttTokenId: Guid;
	setTokenNameMap: Dispatch<SetStateAction<Map<Guid, string>>>;
}

export function TabTokenEntryWrapper({
	vttTokenId,
	setTokenNameMap,
}: TabTokenEntryWrapperProps) {
	const vttToken = useVttTokenStore((state) => state.tokens.get(vttTokenId));

	const targetUrl = (() => {
		if (!vttToken) return null;
		switch (vttToken.type) {
			case "Character":
				return `/chars/${vttToken.targetId}`;
			case "Creature":
				return `/creatures/${vttToken.targetId}`;
			case "Item":
				return `/items/${vttToken.targetId}`;
			default:
				return null;
		}
	})();

	const { data } =
		targetUrl != null
			? useAuthenticatedFetch<{
					character?: CharacterData;
					creature?: CreatureData;
					item?: ItemData;
				}>({
					invalidationKeys: targetUrl ?? [],
					url: targetUrl,
				})
			: {};

	const targetName = (() => {
		switch (vttToken?.type) {
			case "Character":
				return data?.character?.name ?? "";
			case "Creature":
				return data?.creature?.name ?? "";
			case "Item":
				return data?.item?.name ?? "";
			default:
				return vttToken?.name ?? "";
		}
	})();

	useEffect(() => {
		setTokenNameMap((state) => {
			const name = vttToken?.name ?? targetName;
			if (state.get(vttTokenId) === name) return state;

			const next = new Map(state);
			next.set(vttTokenId, name);
			return next;
		});
	}, [vttTokenId, vttToken, setTokenNameMap, data]);

	if (!vttToken) return null;

	return (
		<TabTokenEntry
			vttToken={vttToken}
			name={targetName}
		/>
	);
}

const EntrySeparator = newStyledElement.div(styles.entrySeparator);
const TabTokenEntryElement = newStyledElement.div(styles.tabTokenEntry);
const TabTokenEntryImageContainer = newStyledElement.div(
	styles.tabTokenEntryImageContainer,
);
const TabTokenEntryName = newStyledElement.div(styles.tabTokenEntryName);

interface TabTokenEntryProps {
	vttToken: VttToken;
	name: string;
}
function TabTokenEntry({ vttToken, name }: TabTokenEntryProps) {
	const activeSceneId = useVttContext(
		(state) => state.activeSceneId ?? Guid.Empty,
	);
	const animateCamera = useVttThrottledViewportContext(
		(state) => state.animateCamera,
		500,
	);

	return (
		<div>
			<EntrySeparator />
			<TabTokenEntryElement
				{...setVttElementHoverInteraction("Pointer")}
				onClick={() => {
					const position = vttToken.placements.get(activeSceneId);
					if (!position) return;
					animateCamera({
						position: {
							x: position?.x ?? 0,
							y: position?.y ?? 0,
						},
					});
				}}>
				<TabTokenEntryImageContainer>
					<VttTokenTabEntryImageRenderer vttTokenId={vttToken.id} />
				</TabTokenEntryImageContainer>
				<TabTokenEntryName>{name}</TabTokenEntryName>
			</TabTokenEntryElement>
		</div>
	);
}
