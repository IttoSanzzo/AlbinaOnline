"use client";

import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { HookedForm } from "@/libs/stp@forms";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import {
	AllSearchEntriesByType,
	LintIgnoredAny,
	SearchEntry,
	SearchEntryEntity,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { newStyledElement } from "@setsu-tp/styled-components";
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import styles from "./styles.module.css";
import { useNavigationHistory } from "@/libs/stp@hooks/hooks/useNavigationHistory";
import { coreSearchEntriesMock } from "./extras/coreSearchEntriesMock";
import { focusIntoElementById, getElementById } from "@/utils/General";

const SearchButton = newStyledElement.button(styles.searchButton);

const schema = z.object({
	query: z.string(),
});
type FormData = z.infer<typeof schema>;

const emptySearchEntries: AllSearchEntriesByType = {
	character: [],
	item: [],
	mastery: [],
	skill: [],
	spell: [],
	trait: [],
	race: [],
	user: [],
};

function getPageLinkFromSearchEntry(
	entity: SearchEntryEntity | "Core",
	route: string,
): string {
	switch (entity) {
		case "Character":
			return `/chars/${route}`;
		case "Item":
			return `/items/${route}`;
		case "Mastery":
			return `/maestrias/${route}`;
		case "Skill":
			return `/skills/${route}`;
		case "Spell":
			return `/spells/${route}`;
		case "Trait":
			return `/tracos/${route}`;
		case "Race":
			return `/racas/${route}`;
		case "User":
			return `/users/${route}`;
		case "Core":
			return `/${route}`;
		default:
			return `/home`;
	}
}

function handleAddLinkToHistory(
	searchEntry: SearchEntry,
	setLinkHistoryState: Dispatch<SetStateAction<SearchEntry[]>>,
): void {
	const currentSavedHistoryInMemory = localStorage.getItem("SearchLinkHistory");
	if (currentSavedHistoryInMemory === null) {
		const newLinkHistory = [searchEntry];
		localStorage.setItem("SearchLinkHistory", JSON.stringify(newLinkHistory));
		setLinkHistoryState(newLinkHistory);
		return;
	}
	try {
		const savedParsed: SearchEntry[] = JSON.parse(currentSavedHistoryInMemory);
		const newLinkHistory = [
			searchEntry,
			...savedParsed.filter(
				(entry) =>
					entry.id !== searchEntry.id || entry.entity !== searchEntry.entity,
			),
		].slice(0, 20);
		localStorage.setItem("SearchLinkHistory", JSON.stringify(newLinkHistory));
		setLinkHistoryState(newLinkHistory);
	} catch {
		const newLinkHistory = [searchEntry];
		localStorage.setItem("SearchLinkHistory", JSON.stringify(newLinkHistory));
		setLinkHistoryState(newLinkHistory);
	}
}
function searchEntryToStyledLink(
	searchEntry: SearchEntry,
	setLinkHistoryState: Dispatch<SetStateAction<SearchEntry[]>>,
	setOpenState: Dispatch<SetStateAction<boolean>>,
	form: UseFormReturn<
		{
			query: string;
		},
		LintIgnoredAny,
		{
			query: string;
		}
	>,
	position: number,
	height: number,
	extraHeight: number = 0,
): ReactNode {
	const [x, initialY] = getCoordenates(position, height);
	const y = initialY + extraHeight;
	return (
		<StyledLink
			key={`${searchEntry.type}|${searchEntry.id}`}
			id={`nav-searchbar-entry-|${x}-${y}|`}
			className={styles.searchedLink}
			hoverTitle={searchEntry.title}
			title={
				searchEntry.title.length <= 16
					? searchEntry.title
					: `${searchEntry.title.substring(0, 15)}...`
			}
			href={getPageLinkFromSearchEntry(searchEntry.entity, searchEntry.slug)}
			icon={searchEntry.iconUrl}
			onClick={() => {
				form.setValue("query", "");
				setOpenState(false);
				handleAddLinkToHistory(searchEntry, setLinkHistoryState);
			}}
			onKeyDown={(event) => handleKeyDown(event, x, y)}
		/>
	);
}

export function PageSearchButton() {
	const [openState, setOpenState] = useState<boolean>(false);
	const [usedLinkHistory, setUsedLinkHistory] = useState<SearchEntry[]>([]);
	const [searchEntries, setSearchEntries] =
		useState<AllSearchEntriesByType>(emptySearchEntries);
	const [searchedCoreEntries, setSearchedCoreEntries] = useState<SearchEntry[]>(
		[],
	);
	const navigationHistoryState = useNavigationHistory();

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
				e.preventDefault();
				setOpenState(true);
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
	useEffect(() => {
		const currentSavedHistoryInMemory =
			localStorage.getItem("SearchLinkHistory");
		if (currentSavedHistoryInMemory === null) return;
		try {
			const savedParsed: SearchEntry[] = JSON.parse(
				currentSavedHistoryInMemory,
			);
			setUsedLinkHistory(savedParsed);
		} catch {
			return;
		}
	}, []);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			query: "",
		},
	});
	const watchedValues = form.watch();

	async function onQueryChange(formData: FormData) {
		if (formData.query.length < 3) return;
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(
				`/search?query=${encodeURIComponent(formData.query)}`,
			),
			{ method: "GET", next: { revalidate: 120 } },
		);
		setSearchedCoreEntries(
			coreSearchEntriesMock.filter(
				(entry) =>
					entry.slug.includes(formData.query.toLocaleLowerCase()) ||
					entry.title
						.toLowerCase()
						.includes(formData.query.toLocaleLowerCase()),
			),
		);
		if (!response.ok) {
			setSearchEntries(emptySearchEntries);
			return;
		}
		const data: AllSearchEntriesByType = await response.json();
		setSearchEntries(data);
	}

	const totalEntriesLength =
		searchedCoreEntries.length +
		searchEntries.character.length +
		searchEntries.item.length +
		searchEntries.mastery.length +
		searchEntries.race.length +
		searchEntries.skill.length +
		searchEntries.spell.length +
		searchEntries.trait.length +
		searchEntries.user.length;
	const globalTitleTitleDisable = 1 >= totalEntriesLength;

	function mapRawLinksAndTitlesListIntoElements(
		rawList: linkOrTitleEntry[],
	): ReactNode[] {
		const height = getHeightFromEntries(rawList.length);
		const nodes: ReactNode[] = [];
		for (let index = 0; index < rawList.length; ++index) {
			const [x, y] = getCoordenates(index + 1, height);
			if (rawList[index].type == "title")
				nodes.push(
					typeTitles[rawList[index].value as string as keyof typeof typeTitles](
						x,
						y,
					),
				);
			else
				nodes.push(
					searchEntryToStyledLink(
						rawList[index].value as SearchEntry,
						setUsedLinkHistory,
						setOpenState,
						form,
						index + 1,
						height,
					),
				);
		}
		return nodes;
	}

	const allSearchEntriesAndTitlesRawList = mapSearchEntriesAndTitlesIntoRawList(
		searchedCoreEntries,
		searchEntries,
		!globalTitleTitleDisable,
	);
	const allLinksHeight = getHeightFromEntries(
		allSearchEntriesAndTitlesRawList.length,
	);
	const allLinks: ReactNode[] = mapRawLinksAndTitlesListIntoElements(
		allSearchEntriesAndTitlesRawList,
	);

	const historyEntriesHeight = getHeightFromEntries(
		navigationHistoryState.history.length,
	);
	const usedLinkEntriesHeight = getHeightFromEntries(usedLinkHistory.length);
	const bothHistoriesHeight = historyEntriesHeight + usedLinkEntriesHeight;

	return (
		<Dialog.Root
			open={openState}
			onOpenChange={setOpenState}>
			<Dialog.Trigger asChild>
				<SearchButton>
					{StpIcon({ name: "MagnifyingGlass", style: "duotone" })}
				</SearchButton>
			</Dialog.Trigger>
			<Dialog.Overlay>
				<Dialog.Content>
					<Dialog.Title />
					<Dialog.Description />
					<HookedForm.Form
						form={form}
						onChangeAction={onQueryChange}
						actionDebounceMs={500}>
						<HookedForm.TextInput<FormData>
							fieldName="query"
							id="nav-searchbar-input"
							label="Pesquisar"
							onKeyDown={(event) => {
								if (!(event.key == "ArrowDown" || event.key == "ArrowUp"))
									return;
								event.preventDefault();
								try {
									if (event.key == "ArrowDown")
										return handleKeyDown(event as LintIgnoredAny, 1, 0);
									else if (event.key == "ArrowUp") {
										let totalEntries = 0;
										let totalHeight = 0;
										if (watchedValues.query.length >= 3) {
											totalEntries = allSearchEntriesAndTitlesRawList.length;
											totalHeight = allLinksHeight;
										} else {
											totalEntries =
												navigationHistoryState.history.length +
												usedLinkHistory.length;
											if (
												usedLinkHistory.length > 0 &&
												navigationHistoryState.history.length % 2 != 0
											)
												totalEntries += 1;
											totalHeight = bothHistoriesHeight;
										}
										const [x, y] = getCoordenates(totalEntries, totalHeight);
										focusIntoElementById(`nav-searchbar-entry-|${x}-${y}|`);
									}
								} catch (ex) {
									void ex;
								}
							}}
						/>
					</HookedForm.Form>
					{watchedValues.query.length < 3 ? (
						<>
							{navigationHistoryState.history.length > 0 && (
								<UIBasics.Box
									style={{
										marginBottom: "-2px",
										borderBottomLeftRadius: "0",
										borderBottomRightRadius: "0",
									}}
									withoutPadding
									withoutMargin>
									<UIBasics.Header
										textAlign="center"
										textColor="gray"
										children="Histórico de Navegação"
										headerType="h2"
									/>
									<UIBasics.List.Grid
										withoutBorder
										children={navigationHistoryState.history.map(
											(entry, index) => {
												const [x, y] = getCoordenates(
													index + 1,
													historyEntriesHeight,
												);
												return (
													<StyledLink
														key={entry.url}
														id={`nav-searchbar-entry-|${x}-${y}|`}
														className={styles.searchedLink}
														hoverTitle={entry.name}
														title={
															entry.name.length <= 16
																? entry.name
																: `${entry.name.substring(0, 15)}...`
														}
														href={entry.url}
														icon={entry.icon}
														onClick={() => {
															form.setValue("query", "");
															setOpenState(false);
														}}
														onKeyDown={(event) => handleKeyDown(event, x, y)}
													/>
												);
											},
										)}
									/>
								</UIBasics.Box>
							)}
							{usedLinkHistory.length === 0 ? (
								<UIBasics.Text
									display="block"
									textAlign="center"
									textColor="gray"
									children="Nenhum resultado encontrado"
								/>
							) : (
								<UIBasics.Box
									style={{
										borderTopLeftRadius: "0",
										borderTopRightRadius: "0",
									}}
									withoutPadding
									withoutMargin>
									<UIBasics.Header
										textAlign="center"
										textColor="gray"
										children="Histórico de Pesquisa"
										headerType="h2"
									/>
									<UIBasics.List.Grid
										withoutBorder
										children={usedLinkHistory.map((entry, index) =>
											searchEntryToStyledLink(
												entry,
												setUsedLinkHistory,
												setOpenState,
												form,
												index + 1,
												usedLinkEntriesHeight,
												historyEntriesHeight,
											),
										)}
									/>
								</UIBasics.Box>
							)}
						</>
					) : totalEntriesLength === 0 ? (
						<UIBasics.Text
							display="block"
							textAlign="center"
							textColor="gray"
							children="Nenhum resultado encontrado"
						/>
					) : (
						<UIBasics.List.Grid children={allLinks} />
					)}
				</Dialog.Content>
			</Dialog.Overlay>
		</Dialog.Root>
	);
}

function handleKeyDown(
	event: React.KeyboardEvent<HTMLAnchorElement>,
	horizontalPos: number,
	verticalPos: number,
	isRetry: boolean = false,
) {
	if (
		!(
			event.key == "ArrowUp" ||
			event.key == "ArrowRight" ||
			event.key == "ArrowDown" ||
			event.key == "ArrowLeft"
		)
	)
		return;
	event.preventDefault();
	switch (event.key) {
		case "ArrowUp": {
			return focusIntoEntryOrRetry(
				event,
				horizontalPos,
				verticalPos - 1,
				isRetry,
			);
		}
		case "ArrowRight": {
			if (horizontalPos == 2)
				return focusIntoEntryOrRetry(event, 1, verticalPos + 1, isRetry);
			return focusIntoEntryOrRetry(
				event,
				horizontalPos + 1,
				verticalPos,
				isRetry,
			);
		}
		case "ArrowDown": {
			return focusIntoEntryOrRetry(
				event,
				horizontalPos,
				verticalPos + 1,
				isRetry,
			);
		}
		case "ArrowLeft": {
			if (horizontalPos == 1)
				return focusIntoEntryOrRetry(event, 2, verticalPos - 1, isRetry);
			return focusIntoEntryOrRetry(
				event,
				horizontalPos - 1,
				verticalPos,
				isRetry,
			);
		}
	}
}

function focusIntoEntryOrRetry(
	event: React.KeyboardEvent<HTMLAnchorElement>,
	horizontalPos: number,
	verticalPos: number,
	isRetry: boolean,
): void {
	try {
		const element = getElementById(
			`nav-searchbar-entry-|${horizontalPos}-${verticalPos}|`,
		);
		if (element.tagName != "A")
			return handleKeyDown(event, horizontalPos, verticalPos, false);
		element.focus();
	} catch {
		if (!isRetry) return handleKeyDown(event, horizontalPos, verticalPos, true);
		return focusIntoElementById("nav-searchbar-input");
	}
}

function getHeightFromEntries(
	length: number,
): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 {
	return Math.ceil(length / 2) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}
function getCoordenates(position: number, height: number): [number, number] {
	if (position == 0) return [0, 0];
	if (position > height) return [2, position - height];
	return [1, position];
}

interface linkOrTitleEntry {
	type: "title" | "entry";
	value:
		| "Core"
		| "Character"
		| "Item"
		| "Mastery"
		| "Skill"
		| "Spell"
		| "Trait"
		| "Race"
		| "User"
		| SearchEntry;
}
function mapSearchEntriesAndTitlesIntoRawList(
	coreEntries: SearchEntry[],
	allOthersByType: AllSearchEntriesByType,
	showTitles: boolean,
) {
	const rawList: linkOrTitleEntry[] = [];

	if (coreEntries.length > 0) {
		if (showTitles) rawList.push({ type: "title", value: "Core" });
		for (const entry of coreEntries)
			rawList.push({ type: "entry", value: entry });
	}
	if (allOthersByType.character.length > 0) {
		if (showTitles) rawList.push({ type: "title", value: "Character" });
		for (const entry of allOthersByType.character)
			rawList.push({ type: "entry", value: entry });
	}
	if (allOthersByType.item.length > 0) {
		if (showTitles) rawList.push({ type: "title", value: "Item" });
		for (const entry of allOthersByType.item)
			rawList.push({ type: "entry", value: entry });
	}
	if (allOthersByType.mastery.length > 0) {
		if (showTitles) rawList.push({ type: "title", value: "Mastery" });
		for (const entry of allOthersByType.mastery)
			rawList.push({ type: "entry", value: entry });
	}
	if (allOthersByType.skill.length > 0) {
		if (showTitles) rawList.push({ type: "title", value: "Skill" });
		for (const entry of allOthersByType.skill)
			rawList.push({ type: "entry", value: entry });
	}
	if (allOthersByType.spell.length > 0) {
		if (showTitles) rawList.push({ type: "title", value: "Spell" });
		for (const entry of allOthersByType.spell)
			rawList.push({ type: "entry", value: entry });
	}
	if (allOthersByType.trait.length > 0) {
		if (showTitles) rawList.push({ type: "title", value: "Trait" });
		for (const entry of allOthersByType.trait)
			rawList.push({ type: "entry", value: entry });
	}
	if (allOthersByType.race.length > 0) {
		if (showTitles) rawList.push({ type: "title", value: "Race" });
		for (const entry of allOthersByType.race)
			rawList.push({ type: "entry", value: entry });
	}
	if (allOthersByType.user.length > 0) {
		if (showTitles) rawList.push({ type: "title", value: "User" });
		for (const entry of allOthersByType.user)
			rawList.push({ type: "entry", value: entry });
	}
	return rawList;
}

const typeText = (title: string, x: number, y: number) => (
	<UIBasics.Text
		key={`TypeTitle-${title}`}
		id={`nav-searchbar-entry-|${x}-${y}|`}
		textAlign="center"
		children={title}
		className={styles.searchedTitle}
	/>
);

const typeTitles = {
	Core: (x: number, y: number) => typeText("Core", x, y),
	Character: (x: number, y: number) => typeText("Personagens", x, y),
	Item: (x: number, y: number) => typeText("Items", x, y),
	Mastery: (x: number, y: number) => typeText("Maestrias", x, y),
	Skill: (x: number, y: number) => typeText("Skills", x, y),
	Spell: (x: number, y: number) => typeText("Spells", x, y),
	Trait: (x: number, y: number) => typeText("Traços", x, y),
	Race: (x: number, y: number) => typeText("Raças", x, y),
	User: (x: number, y: number) => typeText("Usuários", x, y),
};
