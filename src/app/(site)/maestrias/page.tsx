import { MasteryData } from "./[mastery]/(routeInfra)/pageData";
import { MasterysContainer } from "./styledElements";
import { NotionHeader, NotionQuote } from "@/components/(NotionBased)";
import { StyledLink } from "@/components/(Design)";

export default async function Masterys() {
	const response = await fetch(`${process.env.ALBINA_API}/masteries`);
	const allRawMasteries: MasteryData[] = await response.json();
	const allMasteries: MasteryData[] = allRawMasteries.sort((a, b) =>
		a.data.name.localeCompare(b.data.name)
	);

	const allExpertiseMasteries = allMasteries.filter(
		(mastery) => mastery.type === "expertise"
	);
	const allKnowledgeMasteries = allMasteries.filter(
		(mastery) => mastery.type === "knowledge"
	);
	const allCraftMasteries = allMasteries.filter(
		(mastery) => mastery.type === "craft"
	);

	return (
		<MasterysContainer>
			<NotionHeader
				textAlign="center"
				backgroundColor="gray"
				children={"Perícias"}
			/>
			{allExpertiseMasteries.map((masteryData) => {
				return (
					<NotionQuote
						key={masteryData.id}
						children={
							<StyledLink
								title={masteryData.data.name}
								href={`/maestrias/${masteryData.slug}`}
								icon={masteryData.data.iconUrl}
							/>
						}
					/>
				);
			})}

			<NotionHeader
				textAlign="center"
				backgroundColor="gray"
				children={"Conhecimentos"}
			/>
			{allKnowledgeMasteries.map((masteryData) => {
				return (
					<NotionQuote
						key={masteryData.id}
						children={
							<StyledLink
								title={masteryData.data.name}
								href={`/maestrias/${masteryData.slug}`}
								icon={masteryData.data.iconUrl}
							/>
						}
					/>
				);
			})}

			<NotionHeader
				textAlign="center"
				backgroundColor="gray"
				children={"Ofícios"}
			/>
			{allCraftMasteries.map((masteryData) => {
				return (
					<NotionQuote
						key={masteryData.id}
						children={
							<StyledLink
								title={masteryData.data.name}
								href={`/maestrias/${masteryData.slug}`}
								icon={masteryData.data.iconUrl}
							/>
						}
					/>
				);
			})}
		</MasterysContainer>
	);
}
