import { GenericPageContainer } from "@/components/(Design)";
import { CharacterFullData } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import {
	Breadcrumb,
	SetBreadcrumbs,
	SetCurrentCharacterAccessLevel,
	SetCurrentPageData,
	SetNavBarModules,
} from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { routeInfra } from "./(routeInfra)";

export const generateMetadata = routeInfra.generateMetadata;
export const generateStaticParams = routeInfra.generateStaticParams;

const characterData: CharacterFullData = {
	id: "928e4a17-86de-4965-b7e4-c1782e561027",
	ownerId: "33bc8235-6ca5-4bf2-ad29-c09dd52019c5",
	name: "Teste",
	iconUrl: `${getAlbinaApiAddress()}/chars/09d648f2-f676-418b-b5c2-9280e657ecf9/favicon`,
	bannerUrl: `${getAlbinaApiAddress()}/chars/09d648f2-f676-418b-b5c2-9280e657ecf9/banner`,
};

interface CharacterPageProps {
	params: Promise<{ charId: string }>;
}
export default async function Character({ params }: CharacterPageProps) {
	// const { charId } = await params;
	// const CharacterPageData = await getPageData(charId);
	// if (CharacterPageData.characterData == undefined) {
	// return <>Error</>;
	// }
	// const { characterData, borderColor } = CharacterPageData;

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/chars",
			name: "Chars",
			icon: `${getAlbinaApiAddress()}/favicon/chars`,
		},
		{
			href: "#",
			name: characterData.name,
			icon: characterData.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title={characterData.name}
			banner={characterData.bannerUrl}
			icon={characterData.iconUrl}
			borderColor={"#505059"}>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
			<SetNavBarModules
				contextMenuButton={routeInfra.PageContextMenu}
				favoriteButton={FavoriteButton}
			/>
			<SetCurrentPageData
				type={"Character"}
				data={characterData}
			/>
			<SetCurrentCharacterAccessLevel characterId={characterData.id} />
		</GenericPageContainer>
	);
}
