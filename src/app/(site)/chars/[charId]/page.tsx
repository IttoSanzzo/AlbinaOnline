import { GenericPageContainer } from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import { SetCurrentPageData } from "@/components/(UTILS)/components/SetCurrentPageData";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface CharacterProps {
	params: Promise<{ charId: string }>;
}

export default async function Character({ params }: CharacterProps) {
	const { charId } = await params;
	const CharacterPageData = await getPageData(charId);
	if (CharacterPageData.characterData == undefined) {
		return <>Error</>;
	}
	const { characterData, borderColor } = CharacterPageData;

	return (
		<GenericPageContainer
			title={characterData.name}
			banner={characterData.bannerUrl}
			icon={characterData.iconUrl}
			borderColor={borderColor}>
			<SetCurrentPageData
				type={"Character"}
				data={characterData}
			/>
		</GenericPageContainer>
	);
}
