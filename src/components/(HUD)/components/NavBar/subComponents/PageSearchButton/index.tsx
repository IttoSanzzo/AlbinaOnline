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
	entity: SearchEntryEntity,
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
		default:
			return `/home`;
	}
}

const typeText = (title: string) => (
	<UIBasics.Text
		key={`TypeTitle-${title}`}
		textAlign="center"
		children={title}
	/>
);

const typeTitles = {
	Character: (hidden: boolean) => (hidden ? null : typeText("Personagens")),
	Item: (hidden: boolean) => (hidden ? null : typeText("Items")),
	Mastery: (hidden: boolean) => (hidden ? null : typeText("Maestrias")),
	Skill: (hidden: boolean) => (hidden ? null : typeText("Skills")),
	Spell: (hidden: boolean) => (hidden ? null : typeText("Spells")),
	Trait: (hidden: boolean) => (hidden ? null : typeText("Traços")),
	Race: (hidden: boolean) => (hidden ? null : typeText("Raças")),
	User: (hidden: boolean) => (hidden ? null : typeText("Usuários")),
};

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
): ReactNode {
	return (
		<StyledLink
			key={`${searchEntry.type}|${searchEntry.id}`}
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
		/>
	);
}

export function PageSearchButton() {
	const [openState, setOpenState] = useState<boolean>(false);
	const [usedLinkHistory, setUsedLinkHistory] = useState<SearchEntry[]>([]);
	const [searchEntries, setSearchEntries] =
		useState<AllSearchEntriesByType>(emptySearchEntries);
	const navigationHistoryState = useNavigationHistory();

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
				e.preventDefault();
				setOpenState(true);
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
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
		if (formData.query.length === 0) return;
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(
				`/search?query=${encodeURIComponent(formData.query)}`,
			),
			{ method: "GET", next: { revalidate: 120 } },
		);
		if (!response.ok) {
			setSearchEntries(emptySearchEntries);
			return;
		}
		const data: AllSearchEntriesByType = await response.json();
		setSearchEntries(data);
	}

	const totalEntriesLength =
		searchEntries.character.length +
		searchEntries.item.length +
		searchEntries.mastery.length +
		searchEntries.race.length +
		searchEntries.skill.length +
		searchEntries.spell.length +
		searchEntries.trait.length +
		searchEntries.user.length;
	const globalTitleTitleDisable = 1 >= totalEntriesLength;

	const allLinks: ReactNode[] = [
		typeTitles.Character(
			globalTitleTitleDisable || searchEntries.character.length === 0,
		),
		searchEntries.character.map((entry) =>
			searchEntryToStyledLink(entry, setUsedLinkHistory, setOpenState, form),
		),
		typeTitles.Item(globalTitleTitleDisable || searchEntries.item.length === 0),
		searchEntries.item.map((entry) =>
			searchEntryToStyledLink(entry, setUsedLinkHistory, setOpenState, form),
		),
		typeTitles.Mastery(
			globalTitleTitleDisable || searchEntries.mastery.length === 0,
		),
		searchEntries.mastery.map((entry) =>
			searchEntryToStyledLink(entry, setUsedLinkHistory, setOpenState, form),
		),
		typeTitles.Race(globalTitleTitleDisable || searchEntries.race.length === 0),
		searchEntries.race.map((entry) =>
			searchEntryToStyledLink(entry, setUsedLinkHistory, setOpenState, form),
		),
		typeTitles.Skill(
			globalTitleTitleDisable || searchEntries.skill.length === 0,
		),
		searchEntries.skill.map((entry) =>
			searchEntryToStyledLink(entry, setUsedLinkHistory, setOpenState, form),
		),
		typeTitles.Spell(
			globalTitleTitleDisable || searchEntries.spell.length === 0,
		),
		searchEntries.spell.map((entry) =>
			searchEntryToStyledLink(entry, setUsedLinkHistory, setOpenState, form),
		),
		typeTitles.Trait(
			globalTitleTitleDisable || searchEntries.trait.length === 0,
		),
		searchEntries.trait.map((entry) =>
			searchEntryToStyledLink(entry, setUsedLinkHistory, setOpenState, form),
		),
		typeTitles.User(globalTitleTitleDisable || searchEntries.user.length === 0),
		searchEntries.user.map((entry) =>
			searchEntryToStyledLink(entry, setUsedLinkHistory, setOpenState, form),
		),
	];

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
							label="Pesquisar"
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
										children={navigationHistoryState.history.map((entry) => (
											<StyledLink
												key={entry.url}
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
											/>
										))}
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
										children={usedLinkHistory.map((entry) =>
											searchEntryToStyledLink(
												entry,
												setUsedLinkHistory,
												setOpenState,
												form,
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
