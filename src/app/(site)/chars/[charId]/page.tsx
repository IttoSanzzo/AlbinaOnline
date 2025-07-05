import { GenericPageContainer } from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import { SetCurrentPageData } from "@/components/(UTILS)/components/SetCurrentPageData";
import { CharacterFullData } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

const characterData: CharacterFullData = {
	id: "09d648f2-f676-418b-b5c2-9280e657ecf9",
	ownerId: "33bc8235-6ca5-4bf2-ad29-c09dd52019c5",
	name: "Teste",
	iconUrl: `${getAlbinaApiAddress()}/chars/09d648f2-f676-418b-b5c2-9280e657ecf9/favicon`,
	bannerUrl: `${getAlbinaApiAddress()}/chars/09d648f2-f676-418b-b5c2-9280e657ecf9/banner`,
};

interface CharacterPageProps {
	params: Promise<{ charId: string }>;
}
export default async function Character({ params }: CharacterPageProps) {
	const { charId } = await params;
	// const CharacterPageData = await getPageData(charId);
	// if (CharacterPageData.characterData == undefined) {
	// return <>Error</>;
	// }
	// const { characterData, borderColor } = CharacterPageData;

	return (
		<GenericPageContainer
			title={characterData.name}
			banner={characterData.bannerUrl}
			icon={characterData.iconUrl}
			borderColor={"#505059"}>
			{""}
			<SetCurrentPageData
				type={"Character"}
				data={characterData}
			/>
		</GenericPageContainer>
	);
}
