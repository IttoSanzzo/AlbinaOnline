import { Metadata } from "next";
import Link from "next/link";

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
		<>
			Root
			<Link href={"/login"}>Login</Link>
		</>
	);
}
