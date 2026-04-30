import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

async function loadCharacterIds(endpoint: string): Promise<string[]> {
	const response = await fetch(getAlbinaApiFullAddress(endpoint), {
		method: "GET",
		next: {
			tags: [endpoint],
		},
	});
	if (!response.ok) return [];
	const { characterIds } = await response.json();
	return characterIds;
}

interface LinkedCharactersProps {
	endpoint: string;
}
export async function LinkedCharacters({ endpoint }: LinkedCharactersProps) {
	const characterIds = await loadCharacterIds(endpoint);
	if (characterIds.length == 0) return null;

	return (
		<>
			<UIBasics.Divisor />
			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.Header
					children={"Personagens Relacionados"}
					textColor="orange"
					textAlign="center"
					headerType="h2"
				/>
				<UIBasics.Box backgroundColor="darkGray">
					<UIBasics.Carousel
						slidesOrigin={characterIds.length > 1 ? "center" : "auto"}
						minWidth={"150px"}
						memoryId={
							characterIds.length > 1 ? `Carousel-${endpoint}` : undefined
						}
						slidesSpacing={5}
						slideChilds={characterIds.map((characterId) => (
							<StyledLinkCard
								key={characterId}
								title={"Clique para abrir"}
								size={150}
								usePreview={false}
								titleColor="gray"
								href={`/chars/${characterId}`}
								artworkUrl={getAlbinaApiFullAddress(
									`/favicon/chars/${characterId}`,
								)}
							/>
						))}
					/>
				</UIBasics.Box>
			</UIBasics.Box>
		</>
	);
}
