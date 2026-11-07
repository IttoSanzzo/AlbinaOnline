import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./TokenRosterTabContent.module.css";
import { useVttTokenStore } from "../../../../Stores/VttTokenStore";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Guid } from "@/libs/stp@types";
import { useVttContext } from "../../../../Contexts/VttContextProvider";
import { VttToken } from "../../../../Types/Classes/VttToken";
import { VttTokenTabEntryImageRenderer } from "../../../VttBoard/TokenBoardLayer/VttTokenImageRenderer";
import { useVttThrottledViewportContext } from "../../../../Contexts/VttThrottledViewportContext";
import { setVttElementHoverInteraction } from "../../../../Utils/ElementDataAttributeUtils";

const TokenRosterTabContentContainer = newStyledElement.div(
	styles.tokenRosterTabContentContainer,
);
const EntryTypeTitle = newStyledElement.p(styles.entryTypeTitle);
const EntryTypeSeparator = newStyledElement.span(styles.entryTypeSeparator);
const TokenEntriesContainer = newStyledElement.div(
	styles.tokenEntriesContainer,
);

export function TokenRosterTabContent() {
	const [tokenNameMap, setTokenNameMap] = useState<Map<Guid, string>>(
		new Map(),
	);
	const activeScene = useVttContext((state) => state.activeSceneId);
	const tokenIds = useVttTokenStore((state) => state.tokenIds);
	const tokensOnScene = useVttTokenStore((state) =>
		state.tokenIdsPerScene.get(activeScene ?? Guid.Empty),
	);

	const { presentTokenIds, absentTokenIds } = useMemo(() => {
		const presentIds = new Set(tokensOnScene ?? []);

		const sortByName = (a: Guid, b: Guid) =>
			(tokenNameMap.get(a) ?? "").localeCompare(
				tokenNameMap.get(b) ?? "",
				"pt-BR",
				{ sensitivity: "base" },
			);

		const present = tokenIds
			.filter((id) => presentIds.has(id))
			.sort(sortByName);

		const absent = tokenIds
			.filter((id) => !presentIds.has(id))
			.sort(sortByName);

		return {
			presentTokenIds: present,
			absentTokenIds: absent,
		};
	}, [tokenIds, tokensOnScene, tokenNameMap]);

	return (
		<TokenRosterTabContentContainer>
			<TokenEntriesContainer>
				{presentTokenIds.length == 0 && absentTokenIds.length == 0 && (
					<EntryTypeTitle>Sem Tokens</EntryTypeTitle>
				)}
				{presentTokenIds.length > 0 && (
					<>
						<EntryTypeTitle>Na Cena</EntryTypeTitle>
						{presentTokenIds.map((tokenId) => (
							<TabTokenEntryWrapper
								key={tokenId}
								vttTokenId={tokenId}
								setTokenNameMap={setTokenNameMap}
							/>
						))}
					</>
				)}
				<EntryTypeSeparator />
				{absentTokenIds.length > 0 && (
					<>
						<EntryTypeTitle>Ausentes</EntryTypeTitle>
						{absentTokenIds.map((tokenId) => (
							<TabTokenEntryWrapper
								key={tokenId}
								vttTokenId={tokenId}
								setTokenNameMap={setTokenNameMap}
							/>
						))}
					</>
				)}
			</TokenEntriesContainer>
		</TokenRosterTabContentContainer>
	);
}

interface TabTokenEntryWrapperProps {
	vttTokenId: Guid;
	setTokenNameMap: Dispatch<SetStateAction<Map<Guid, string>>>;
}
function TabTokenEntryWrapper({
	vttTokenId,
	setTokenNameMap,
}: TabTokenEntryWrapperProps) {
	const vttToken = useVttTokenStore((state) => state.tokens.get(vttTokenId));

	useEffect(() => {
		setTokenNameMap((state) => {
			const targetName = vttTokenId;
			if (state.get(vttTokenId) === targetName) return state;
			const next = new Map(state);
			next.set(vttTokenId, targetName);
			return next;
		});
	}, [vttTokenId, setTokenNameMap]);

	if (!vttToken) return null;

	return <TabTokenEntry vttToken={vttToken} />;
}

const EntrySeparator = newStyledElement.div(styles.entrySeparator);
const TabTokenEntryElement = newStyledElement.div(styles.tabTokenEntry);
const TabTokenEntryImageContainer = newStyledElement.div(
	styles.tabTokenEntryImageContainer,
);

interface TabTokenEntryProps {
	vttToken: VttToken;
}
function TabTokenEntry({ vttToken }: TabTokenEntryProps) {
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
				{/* {vttToken.id} */}
			</TabTokenEntryElement>
		</div>
	);
}
