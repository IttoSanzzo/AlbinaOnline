import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./TokenRosterTabContent.module.css";
import { useVttTokenStore } from "../../../../Stores/VttTokenStore";
import { useMemo, useState } from "react";
import { Guid } from "@/libs/stp@types";
import { useVttContext } from "../../../../Contexts/VttContextProvider";
import { TabTokenEntryWrapper } from "./TabTokenEntry";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";

const TokenRosterTabContentContainer = newStyledElement.div(
	styles.tokenRosterTabContentContainer,
);
const EntryTypeTitle = newStyledElement.p(styles.entryTypeTitle);
const EntryTypeSeparator = newStyledElement.span(styles.entryTypeSeparator);
const TokenEntriesContainer = newStyledElement.div(
	styles.tokenEntriesContainer,
);

const schema = z.object({
	query: z.string(),
});
type FormData = z.infer<typeof schema>;

export function TokenRosterTabContent() {
	const [tokenNameMap, setTokenNameMap] = useState<Map<Guid, string>>(
		new Map(),
	);
	const [filterString, setFilterString] = useState<string>("");
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

		const filterByName = (id: Guid) =>
			filterString.length == 0 ||
			tokenNameMap.get(id)?.toLowerCase().includes(filterString);

		const present = tokenIds
			.filter((id) => presentIds.has(id) && filterByName(id))
			.sort(sortByName);

		const absent = tokenIds
			.filter((id) => !presentIds.has(id) && filterByName(id))
			.sort(sortByName);

		return {
			presentTokenIds: present,
			absentTokenIds: absent,
		};
	}, [tokenIds, tokensOnScene, tokenNameMap, filterString]);

	function handleAction({ query }: FormData) {
		if (query.trim().length < 1) setFilterString("");
		else setFilterString(query.trim().toLowerCase());
	}

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			query: "",
		},
	});

	return (
		<TokenRosterTabContentContainer>
			<HookedForm.Form
				form={form}
				actionDebounceMs={300}
				onChangeAction={handleAction}>
				<HookedForm.TextInput<FormData>
					fieldName={"query"}
					label={""}
					placeholder={"Filtrar GridMaps"}
					style={{
						textAlign: "center",
						paddingTop: "10px",
						paddingBottom: "10px",
						color: "var(--cl-gray-300)",
						backgroundColor: "rgb(from var(--cl-black-3) r g b / 25%)",
					}}
				/>
			</HookedForm.Form>
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
