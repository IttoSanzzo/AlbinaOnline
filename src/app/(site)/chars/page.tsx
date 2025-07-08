import { GenericPageContainer, StyledLinkCard } from "@/components/(Design)";
import { StyledOwnedLinkCard } from "@/components/(Design)/components/StyledOwnedLinkCard";
import { NotionGridList } from "@/components/(UTILS)";
import { SetNavBarModules } from "@/libs/stp@hooks";
import { CharacterSimpleData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import { PageContextMenu } from "./(routeInfra)/PageContextMenu";

export default async function Characters() {
	// const response = await fetch(`${process.env.ALBINA_API}/chars`, {
	// 	cache: await getCacheMode(),
	// });
	// const allRawCharacters: CharacterSimpleData[] = await response.json();
	// const allCharacters: CharacterSimpleData[] = allRawCharacters.sort((a, b) =>
	// 	a.name.localeCompare(b.name)
	// );

	return (
		<GenericPageContainer
			title="Todos os Chars"
			icon={`${process.env.ALBINA_API}/favicon/core-page/characters`}
			banner={`${process.env.ALBINA_API}/banner/core-page/characters`}>
			<SetNavBarModules contextMenuButton={PageContextMenu} />

			<StyledOwnedLinkCard
				ownerId="33bc8235-6ca5-4bf2-ad29-c09dd52019c5"
				href={"/chars/teste"}
				title="Hirone Sanzzo"
				artworkUrl={"https://avatars.githubusercontent.com/u/106534001?v=4"}
				// layout="rectangle"
			/>
			<NotionGridList minColumnWidth={150}>
				<StyledLinkCard
					href={""}
					title="Hirone Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/106534001?v=4"}
					layout="rectangle"
				/>
				<StyledLinkCard
					href={""}
					title="Itto Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/106534001?v=4"}
					layout="rectangle"
				/>
				<StyledLinkCard
					href={""}
					title="Katrina Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/175269519?v=4"}
					layout="rectangle"
				/>
				<StyledLinkCard
					href={""}
					title="Katrina Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/175269519?v=4"}
					layout="rectangle"
				/>
				<StyledLinkCard
					href={""}
					title="Hirone Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/106534001?v=4"}
					layout="rectangle"
				/>
				<StyledLinkCard
					href={""}
					title="Hirone Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/106534001?v=4"}
					layout="rectangle"
				/>
				<StyledLinkCard
					href={""}
					title="Itto Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/106534001?v=4"}
					layout="rectangle"
				/>
				<StyledLinkCard
					href={""}
					title="Katrina Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/175269519?v=4"}
					layout="rectangle"
				/>
				<StyledLinkCard
					href={""}
					title="Katrina Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/175269519?v=4"}
					layout="rectangle"
				/>
				<StyledLinkCard
					href={""}
					title="Hirone Sanzzo"
					artworkUrl={"https://avatars.githubusercontent.com/u/106534001?v=4"}
					// layout="rectangle"
				/>
			</NotionGridList>
		</GenericPageContainer>
	);
}
