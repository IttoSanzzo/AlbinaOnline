import { GenericPageContainer, StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://albina.setsu.party"),
	title: "Albina RPG",
	description: "Albina RPG | SetsuTeaPartys's Tabletop RPG system",
	icons: "/favicon.ico",
	openGraph: {
		title: "Albina RPG",
		description: "Albina RPG | SetsuTeaPartys's Tabletop RPG system",
		url: "https://albina.setsu.party",
		siteName: "Albina RPG",
		images: [
			{
				url: "/link-preview/og_preview_v2.png",
				width: 1200,
				height: 630,
				alt: "Albina RPG",
			},
		],
		countryName: "Brazil",
		locale: "pt_BR",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Albina RPG",
		description: "Albina RPG | SetsuTeaPartys's Tabletop RPG system",
		images: [
			{
				url: "/link-preview/og_preview_v2.png",
				width: 1200,
				height: 630,
				alt: "Albina RPG",
			},
		],
	},
};

export default function RootPage() {
	return (
		<GenericPageContainer
			title="Albina Online"
			icon={getAlbinaApiFullAddress("/favicon/home")}
			banner={getAlbinaApiFullAddress("/banner/root")}>
			<UIBasics.Box
				alignItems="center"
				withoutBorder>
				<StyledLinkCard
					href={"/login"}
					artworkUrl={getAlbinaApiFullAddress("/favicon/default/configuration")}
					size={200}
					title="Login"
					titleAlwaysOpen
				/>
			</UIBasics.Box>
		</GenericPageContainer>
	);
}
