import { MasteryData } from "./[mastery]/(routeInfra)/pageData";
import { MasterysContainer } from "./styledElements";
import { NotionHeader, NotionQuote } from "@/components/(NotionBased)";
import {
	GenericPageContainer,
	GenericPageFooter,
	StyledLink,
} from "@/components/(Design)";
import { NotionGridList } from "@/components/(UTILS)";

export default async function Masterys() {
	const response = await fetch(`${process.env.ALBINA_API}/maestrias`, {
		cache: "force-cache",
	});
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
		<GenericPageContainer title="Maestrias">
			<MasterysContainer>
				<NotionHeader
					textAlign="center"
					backgroundColor="gray"
					children={"Perícias"}
				/>
				<NotionGridList
					backgroundColor="purple"
					columns={5}>
					{allExpertiseMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.data.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.data.iconUrl}
							display="flexbox"
						/>
					))}
				</NotionGridList>

				<NotionHeader
					textAlign="center"
					backgroundColor="gray"
					children={"Conhecimentos"}
				/>
				<NotionGridList
					backgroundColor="purple"
					columns={5}>
					{allKnowledgeMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.data.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.data.iconUrl}
							display="flexbox"
						/>
					))}
				</NotionGridList>

				<NotionHeader
					textAlign="center"
					backgroundColor="gray"
					children={"Ofícios"}
				/>
				<NotionGridList
					backgroundColor="purple"
					columns={5}>
					{allCraftMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.data.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.data.iconUrl}
							display="flexbox"
						/>
					))}
				</NotionGridList>
				<GenericPageFooter version="7.0.0" />
			</MasterysContainer>
		</GenericPageContainer>
	);
}
