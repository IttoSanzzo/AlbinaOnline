import { Metadata } from "next";

type OGImage = {
	url: string;
	width?: number;
	height?: number;
	alt?: string;
};

interface AssembleMetadataProps {
	title?: string;
	description?: string;
	icon?: string;
	route?: string;
	ogImage?: OGImage | OGImage[];
}
export function assembleMetadata({
	title,
	description,
	icon = "/favicon.ico",
	route = "",
	ogImage = {
		url: "/link-preview/og_preview_v2.png",
		width: 1200,
		height: 630,
	},
}: AssembleMetadataProps): Metadata {
	const finalTitle = title ? `Albina | ${title}` : "Albina RPG";
	const finalDescription = description
		? `Albina | ${description} | SetsuTeaPartys's Tabletop RPG system`
		: "Albina | SetsuTeaPartys's Tabletop RPG system";
	if (Array.isArray(ogImage)) {
		ogImage.forEach((image) => {
			if (!image.alt) image.alt = image.url;
		});
	} else if (!ogImage.alt) ogImage.alt = ogImage.url;

	return {
		metadataBase: new URL("https://albina.setsu.party"),
		title: finalTitle,
		description: finalDescription,
		icons: icon,
		openGraph: {
			title: finalTitle,
			description: finalDescription,
			url: `https://albina.setsu.party${route}`,
			siteName: "Albina RPG",
			images: ogImage,
			countryName: "Brazil",
			locale: "pt_BR",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: finalTitle,
			description: finalDescription,
			images: ogImage,
		},
	};
}
