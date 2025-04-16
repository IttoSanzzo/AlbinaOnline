import { capitalizeAll } from "@/utils/StringUtils";
import { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ mastery: string }>;
}): Promise<Metadata> {
	const { mastery } = await params;
	const title: string = `Maestria - ${capitalizeAll(
		mastery.replace("-", " ")
	)}`;

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
