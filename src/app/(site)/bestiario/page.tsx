import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { GenericPageContainer } from "@/components/(Design)";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { CreatureData } from "@/libs/stp@types";

export const metadata: Metadata = assembleMetadata({
	title: "Bestiário",
	icon: getAlbinaApiFullAddress("/favicon/core-page/bestiary"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/bestiary"),
	},
	route: "/bestiario",
});

export default async function BestiaryPage() {
	const response = await fetch(getAlbinaApiFullAddress("/bestiary?mode=lite"), {
		next: { tags: ["/bestiary"] },
	});
	const entities = (
		(response.ok ? await response.json() : []) as CreatureData[]
	).sort((a, b) => a.name.localeCompare(b.name));

	return (
		<GenericPageContainer
			title="Bestiário"
			icon={getAlbinaApiFullAddress("/favicon/core-page/bestiary")}
			banner={getAlbinaApiFullAddress("/banner/core-page/bestiary")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />
			<PageView entities={entities} />
		</GenericPageContainer>
	);
}

const anchorNavigationData: AnchorProps[] = [
	{ name: "Search", id: "search-bar" },
	{ name: "Nível -1", indentation: 1 },
	{ name: "Nível 0", indentation: 1 },
	{ name: "Nível 1", indentation: 1 },
	{ name: "Nível 2", indentation: 1 },
	{ name: "Nível 3", indentation: 1 },
	{ name: "Nível 4", indentation: 1 },
	{ name: "Nível 5", indentation: 1 },
	{ name: "Nível 6", indentation: 1 },
	{ name: "Nível 7", indentation: 1 },
	{ name: "Nível 8", indentation: 1 },
	{ name: "Nível 9", indentation: 1 },
	{ name: "Nível 10", indentation: 1 },
	{ name: "Nível 11", indentation: 1 },
	{ name: "Nível 12", indentation: 1 },
	{ name: "Nível 13", indentation: 1 },
	{ name: "Nível 14", indentation: 1 },
	{ name: "Nível 15", indentation: 1 },
	{ name: "Nível 16", indentation: 1 },
	{ name: "Nível 17", indentation: 1 },
	{ name: "Nível 18", indentation: 1 },
	{ name: "Nível 19", indentation: 1 },
	{ name: "Nível 20", indentation: 1 },
	{ name: "Nível 21", indentation: 1 },
	{ name: "Nível 22", indentation: 1 },
	{ name: "Nível 23", indentation: 1 },
	{ name: "Nível 24", indentation: 1 },
	// { name: "Nível 25", indentation: 1 },
	{ name: "Nível 26", indentation: 1 },
	// { name: "Nível 27", indentation: 1 },
	// { name: "Nível 28", indentation: 1 },
	// { name: "Nível 29", indentation: 1 },
	{ name: "Nível 30", indentation: 1 },
	// { name: "Nível 31", indentation: 1 },
	// { name: "Nível 32", indentation: 1 },
	// { name: "Nível 33", indentation: 1 },
	// { name: "Nível 34", indentation: 1 },
	// { name: "Nível 35", indentation: 1 },
	// { name: "Nível 36", indentation: 1 },
	{ name: "Todos", indentation: 0 },
	{ name: "A", id: "letter-a", indentation: 1 },
	{ name: "B", id: "letter-b", indentation: 1 },
	{ name: "C", id: "letter-c", indentation: 1 },
	{ name: "D", id: "letter-d", indentation: 1 },
	{ name: "E", id: "letter-e", indentation: 1 },
	{ name: "F", id: "letter-f", indentation: 1 },
	{ name: "G", id: "letter-g", indentation: 1 },
	{ name: "H", id: "letter-h", indentation: 1 },
	{ name: "I", id: "letter-i", indentation: 1 },
	{ name: "J", id: "letter-j", indentation: 1 },
	{ name: "K", id: "letter-k", indentation: 1 },
	{ name: "L", id: "letter-l", indentation: 1 },
	{ name: "M", id: "letter-m", indentation: 1 },
	{ name: "N", id: "letter-n", indentation: 1 },
	{ name: "O", id: "letter-o", indentation: 1 },
	{ name: "P", id: "letter-p", indentation: 1 },
	{ name: "Q", id: "letter-q", indentation: 1 },
	{ name: "R", id: "letter-r", indentation: 1 },
	{ name: "S", id: "letter-s", indentation: 1 },
	{ name: "T", id: "letter-t", indentation: 1 },
	{ name: "U", id: "letter-u", indentation: 1 },
	{ name: "V", id: "letter-v", indentation: 1 },
	{ name: "W", id: "letter-w", indentation: 1 },
	{ name: "X", id: "letter-x", indentation: 1 },
	{ name: "Y", id: "letter-y", indentation: 1 },
	{ name: "Z", id: "letter-z", indentation: 1 },
];
