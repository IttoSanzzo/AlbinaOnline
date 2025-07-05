import { GenericPageContainer, StyledLinkCard } from "@/components/(Design)";
import { StyledOwnedLinkCard } from "@/components/(Design)/components/StyledOwnedLinkCard";
import { NotionGridList } from "@/components/(UTILS)";
import { CharacterSimpleData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";

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
			icon={`${process.env.ALBINA_API}/favicon/chars`}
			banner={`${process.env.ALBINA_API}/banner/chars`}>
			<StyledOwnedLinkCard
				ownerId="b0eeea5d-a780-4279-b3bc-395505549c4b"
				href={""}
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
