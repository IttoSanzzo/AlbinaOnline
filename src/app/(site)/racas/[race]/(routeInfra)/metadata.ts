import { capitalizeAll } from "@/utils/StringUtils";
import { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ race: string }>;
}): Promise<Metadata> {
	// console.log("Banana");

	const { race } = await params;
	const title: string = `Raça - ${capitalizeAll(race.replace("-", " "))}`;

	return {
		title,
		// icons: {
		// icon: `https://meusite.com/api/icone?slug=${mastery}`,
		// },
		// openGraph: {
		// title: `Produto: ${slug}`,
		// images: [`https://meusite.com/api/imagem?slug=${slug}`],
		// },
	};
}
