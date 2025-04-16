import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import {
	NotionHeader,
	Notion2Columns,
	NotionCallout,
	NotionQuote,
	NotionToggle,
	NotionDivisor,
	NotionTable,
} from "@/components/(NotionBased)";
import { getPageData } from "./(routeInfra)";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface MasteryData {
	name: string;
}

interface MasteryProps {
	params: Promise<{ mastery: string }>;
}

export default async function Mastery({ params }: MasteryProps) {
	const { mastery } = await params;
	const pageData = getPageData(mastery);

	return (
		<GenericPageContainer
			title={`⩤Maestria - ${mastery.replace("-", " ")}⩥`}
			banner={AlbinaLogo}
			favicon={AlbinaLogo}>
			<NotionHeader
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<Notion2Columns
				colum1={
					<NotionCallout
						icon={{
							name: "IdentificationCard",
							color: "purple",
						}}
						titleColor="gray"
						title={"Tipologia"}>
						<NotionTable
							tableData={{
								tableLanes: [
									["💮Perícia", "🪡"],
									["🦵🏻⸙ Agilidade ⸙ ", "⊱🦵🏻"],
								],
							}}
						/>
					</NotionCallout>
				}
				colum2={
					<NotionCallout
						icon={{
							name: "Info",
							color: "purple",
						}}
						titleColor="gray"
						title={"Info"}>
						<NotionToggle
							titleColor="blue"
							title={"🪄|Resumo|🪄"}>
							<NotionDivisor />
							<NotionQuote
								children={
									"Capacidade e preparação física para performar diferentes movimentações incomuns, tais como mortais, cambalhotas, e demais artifícios."
								}></NotionQuote>
							<NotionDivisor />
						</NotionToggle>
						<NotionToggle
							titleColor="blue"
							title={"🔎|Descrição Geral|🔎"}>
							<NotionDivisor />
							<NotionQuote
								children={
									"Essa Perícia é mais apropriada para movimentações que requerem uma resolução rápida de uma enrascada, e pode muitas vezes se requisitada juntamente a outra, como salto, equilíbrio, escalada, e afins."
								}
							/>
							<NotionDivisor />
						</NotionToggle>
						<NotionToggle
							titleColor="blue"
							title={"💮|Miscelâneas|💮"}>
							<NotionDivisor />
							<NotionQuote children={""} />
							<NotionDivisor />
						</NotionToggle>
					</NotionCallout>
				}
			/>

			<NotionHeader
				textColor="orange"
				backgroundColor="gray"
				textAlign="center"
				children={"🏮 Efeitos 🏮"}
			/>
			<NotionCallout
				icon={{ name: "PlusCircle", color: "purple" }}
				titleColor="purple"
				title={"primario"}>
				<NotionQuote
					children={
						"Per Level: +1 de bônus para jogadas em testes nessa perícia."
					}
				/>
			</NotionCallout>
			<GenericPageFooter version="6.4.8" />
		</GenericPageContainer>
	);
}
