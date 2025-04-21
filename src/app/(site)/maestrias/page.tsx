import { MasteryData } from "./[mastery]/(routeInfra)/pageData";
import { MasterysContainer } from "./styledElements";
import { NotionHeader } from "@/components/(NotionBased)";
import {
	GenericPageContainer,
	GenericPageFooter,
	StyledLink,
} from "@/components/(Design)";
import { NotionGridList } from "@/components/(UTILS)";
import { AnchorProps } from "@/components/(HUD)";

const pageAnchors: AnchorProps[] = [
	{ name: "Proficiências", id: "Proficiências" },
	{ name: "Perícias", id: "Perícias" },
	{ name: "Conhecimentos", id: "Conhecimentos" },
	{ name: "Ofícios", id: "Ofícios" },
];

export default async function Masterys() {
	const response = await fetch(`${process.env.ALBINA_API}/maestrias`, {
		cache: "force-cache",
	});
	const allRawMasteries: MasteryData[] = await response.json();
	const allMasteries: MasteryData[] = allRawMasteries.sort((a, b) =>
		a.data.name.localeCompare(b.data.name)
	);

	const allProficiencyMasteries = allMasteries.filter(
		(mastery) => mastery.type === "proficiency"
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
		<GenericPageContainer
			title="Maestrias"
			anchors={pageAnchors}>
			<MasterysContainer>
				<NotionHeader
					textAlign="center"
					backgroundColor="gray"
					children={"Proficiências"}
				/>
				<NotionGridList
					backgroundColor="purple"
					columns={5}>
					{allProficiencyMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.data.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.data.iconUrl}
						/>
					))}
				</NotionGridList>

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
						/>
					))}
				</NotionGridList>

				<GenericPageFooter version="7.0.0" />
			</MasterysContainer>
		</GenericPageContainer>
	);
}
