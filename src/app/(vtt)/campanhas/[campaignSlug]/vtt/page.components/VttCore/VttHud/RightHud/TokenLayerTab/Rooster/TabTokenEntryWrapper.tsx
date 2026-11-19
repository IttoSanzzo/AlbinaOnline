import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./TabTokenEntryWrapper.module.css";
import { useVttTokenStore } from "../../../../../Stores/VttTokenStore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Guid } from "@/libs/stp@types";
import { useVttContext } from "../../../../../Contexts/VttContextProvider";
import {
	RawVttToken,
	VttToken,
	vttTokenCanBeOperatedBy,
} from "../../../../../Types/Classes/VttToken";
import { VttTokenTabEntryImageRenderer } from "../../../../VttBoard/TokenBoardLayer/VttTokenImageRenderer";
import { useVttThrottledViewportContext } from "../../../../../Contexts/VttThrottledViewportContext";
import { setVttElementHoverInteraction } from "../../../../../Utils/ElementDataAttributeUtils";
import { useAuthenticatedFetch } from "@/libs/stp@data-fetching";
import { forwardToToken } from "../../../../../Hooks/useVttResourceDrag.utils";
import { VttTokenPlacementPreview } from "../Components/VttTokenPlacementPreview";
import { useCurrentCampaignMemberStore } from "@/libs/stp@hooks";
import { StpIcon } from "@/libs/stp@icons";

const defaultTargetName = "Nameless";

interface TabTokenEntryWrapperProps {
	vttTokenId: Guid;
	setTokenNameMap: Dispatch<SetStateAction<Map<Guid, string>>>;
	isInScene: boolean;
}
export function TabTokenEntryWrapper({
	vttTokenId,
	setTokenNameMap,
	isInScene,
}: TabTokenEntryWrapperProps) {
	const vttToken = useVttTokenStore((state) => state.tokens.get(vttTokenId));

	const targetUrl = (() => {
		if (!vttToken || vttToken.name) return null;
		switch (vttToken.type) {
			case "Character":
				return `/chars/${vttToken.targetId}`;
			case "Creature":
				return `/bestiary/by-id/${vttToken.targetId}`;
			case "Item":
				return `/items/by-id/${vttToken.targetId}`;
			default:
				return null;
		}
	})();

	const { data } =
		targetUrl != null
			? useAuthenticatedFetch<{
					name?: string;
					character?: { name: string };
				}>({
					invalidationKeys: targetUrl ?? [],
					url: targetUrl,
				})
			: {};

	const targetName = (() => {
		if (vttToken?.name) return vttToken.name;
		switch (vttToken?.type) {
			case "Character":
				return data?.character?.name ?? defaultTargetName;
			case "Creature":
				return data?.name ?? defaultTargetName;
			case "Item":
				return data?.name ?? defaultTargetName;
			default:
				return defaultTargetName;
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
			isInScene={isInScene}
		/>
	);
}

const EntrySeparator = newStyledElement.div(styles.entrySeparator);
const TabTokenEntryElement = newStyledElement.div(styles.tabTokenEntry);
const TabTokenEntryImageContainer = newStyledElement.div(
	styles.tabTokenEntryImageContainer,
);
const TabTokenEntryName = newStyledElement.div(styles.tabTokenEntryName);
const TabEntryIndicatorsContainer = newStyledElement.div(
	styles.tabEntryIndicatorsContainer,
);
const TabEntryIndicator = newStyledElement.div(styles.tabEntryIndicator);

interface TabTokenEntryProps {
	vttToken: VttToken;
	name: string;
	isInScene: boolean;
}
function TabTokenEntry({ vttToken, name, isInScene }: TabTokenEntryProps) {
	const [isPlacementActive, setPlacementActive] = useState(false);
	const isMaster =
		useCurrentCampaignMemberStore((state) => state.isMaster) ?? false;
	const userId =
		useCurrentCampaignMemberStore((state) => state.member?.userId) ?? null;
	const activeSceneId = useVttContext(
		(state) => state.activeSceneId ?? Guid.Empty,
	);
	const send = useVttContext((state) => state.send);
	const animateCamera = useVttThrottledViewportContext(
		(state) => state.animateCamera,
		500,
	);

	const isEditable = vttTokenCanBeOperatedBy(vttToken, userId, isMaster);

	return (
		<>
			<div>
				<EntrySeparator />
				<TabTokenEntryElement
					{...setVttElementHoverInteraction("Pointer")}
					{...(isEditable
						? isInScene
							? forwardToToken({ tokenId: vttToken.id })
							: {
									onPointerDown: (event) => {
										if (event.button == 0) setPlacementActive(true);
									},
								}
						: undefined)}
					onClick={() => {
						if (!isInScene) return;
						const position = vttToken.placements.get(activeSceneId);
						if (!position) return;
						const element = document.getElementById(
							`board-token-anchor-${vttToken.id}`,
						);
						if (element) element.focus();
						animateCamera({
							position: {
								x: position.x,
								y: position.y,
							},
						});
					}}>
					<TabTokenEntryImageContainer>
						<VttTokenTabEntryImageRenderer vttTokenId={vttToken.id} />
					</TabTokenEntryImageContainer>
					<TabEntryIndicatorsContainer>
						<TabEntryIndicator>
							<StpIcon
								name={"Feather"}
								color={
									isMaster ? "yellow" : isEditable ? "lightBlue" : "darkGray"
								}
							/>
						</TabEntryIndicator>
					</TabEntryIndicatorsContainer>
					<TabTokenEntryName>{name}</TabTokenEntryName>
				</TabTokenEntryElement>
			</div>

			{isPlacementActive && (
				<VttTokenPlacementPreview
					tokenId={vttToken.id}
					appearance={vttToken.appearance}
					onPlace={(coordinates) => {
						setPlacementActive(false);
						const newVttToken: RawVttToken = {
							...vttToken,
							placements: Array.from(vttToken.placements.values()).map(
								(placement) => ({ ...placement, scene: undefined! }),
							),
						};

						newVttToken.placements = [
							...newVttToken.placements.filter(
								(placement) => placement.sceneId != activeSceneId,
							),
							{
								id:
									vttToken.placements.get(activeSceneId)?.id ?? Guid.NewGuid(),
								sceneId: activeSceneId,
								tokenId: vttToken.id,
								x: coordinates.x,
								y: coordinates.y,
								token: undefined!,
								scene: undefined!,
							},
						];

						send({
							id: Guid.NewGuid(),
							path: "/tokens",
							method: "Put",
							data: { vttToken: newVttToken },
						});
					}}
					onCancel={() => setPlacementActive(false)}
					validatePlacement={(_, pointerPosition) => {
						const element = document.getElementById("VttHud-RightHud");
						if (!element) return true;

						const rect = element.getBoundingClientRect();

						return !(
							pointerPosition.x >= rect.left &&
							pointerPosition.x <= rect.right &&
							pointerPosition.y >= rect.top &&
							pointerPosition.y <= rect.bottom
						);
					}}
				/>
			)}
		</>
	);
}
