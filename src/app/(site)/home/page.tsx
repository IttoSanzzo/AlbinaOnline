import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { GenericPageContainer, StyledLinkCard } from "@/components/(Design)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";

// const HomeContainer = newStyledElement.div(styles.homeContainer);

export const metadata: Metadata = assembleMetadata({
	title: "Home",
});

export default function HomePage() {
	// return <HomeContainer></HomeContainer>;
	return (
		<GenericPageContainer
			title="Albina Online | Home"
			icon={getAlbinaApiFullAddress("/favicon/home")}
			banner={getAlbinaApiFullAddress("/banner/home")}>
			<UIBasics.List.Grid
				direction="row"
				backgroundColor="darkGray">
				<StyledLinkCard
					artworkUrl={getAlbinaApiFullAddress("/favicon/core-page/chars")}
					href="/chars"
					title="Chars"
					titleAlwaysOpen
				/>
				<StyledLinkCard
					artworkUrl={getAlbinaApiFullAddress("/favicon/core-page/items")}
					href="/items"
					title="Items"
					titleAlwaysOpen
				/>
				<StyledLinkCard
					artworkUrl={getAlbinaApiFullAddress("/favicon/core-page/masteries")}
					href="/maestrias"
					title="Maestrias"
					titleAlwaysOpen
				/>
				<StyledLinkCard
					artworkUrl={getAlbinaApiFullAddress("/favicon/core-page/skills")}
					href="/skills"
					title="Skills"
					titleAlwaysOpen
				/>
				<StyledLinkCard
					artworkUrl={getAlbinaApiFullAddress("/favicon/core-page/spells")}
					href="/spells"
					title="Spells"
					titleAlwaysOpen
				/>
				<StyledLinkCard
					artworkUrl={getAlbinaApiFullAddress("/favicon/core-page/traits")}
					href="/tracos"
					title="Traços"
					titleAlwaysOpen
				/>
				<StyledLinkCard
					artworkUrl={getAlbinaApiFullAddress("/favicon/core-page/races")}
					href="/racas"
					title="Raças"
					titleAlwaysOpen
				/>
				<StyledLinkCard
					artworkUrl={getAlbinaApiFullAddress("/favicon/core-page/users")}
					href="/users"
					title="Usuários"
					titleAlwaysOpen
				/>
				<StyledLinkCard
					artworkUrl={getAlbinaApiFullAddress("/favicon/core-page/codex")}
					href="/codex"
					title="Codex"
					titleAlwaysOpen
				/>
			</UIBasics.List.Grid>
		</GenericPageContainer>
	);
}
