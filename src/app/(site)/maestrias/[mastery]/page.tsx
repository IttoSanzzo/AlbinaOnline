import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import GenericPageContainer from "@/components/(Design)/GenericPageContainer";
import GenericPageFooter from "@/components/(Design)/GenericPageFooter";
import Notion2Columns from "@/components/(NotionBased)/Notion2Columns";
import NotionCallout from "@/components/(NotionBased)/NotionCallout";
import NotionDivisor from "@/components/(NotionBased)/NotionDivisor";
import NotionHeader from "@/components/(NotionBased)/NotionHeader";
import NotionQuote from "@/components/(NotionBased)/NotionQuote";
import NotionTable from "@/components/(NotionBased)/NotionTable";
import NotionToggle from "@/components/(NotionBased)/NotionToggle";

interface MasteryData {
	name: string;
}

interface MasteryProps {
	params: Promise<{ mastery: string }>;
}

export default async function Mastery({ params }: MasteryProps) {
	const { mastery } = await params;

	return (
		<GenericPageContainer
			title={`⩤Maestria - ${mastery.replace("-", " ")}⩥`}
			banner={AlbinaLogo}
			favicon={AlbinaLogo}>
			<NotionHeader
				textColor="purple"
				backgroundColor="gray"
				textAlign="center">
				¤ Especificações ¤
			</NotionHeader>
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
				textAlign="center">
				🏮 Efeitos 🏮
			</NotionHeader>
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

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return [
		{ mastery: "acrobacia" },
		{ mastery: "alerta" },
		{ mastery: "arcanismo" },
		{ mastery: "atletismo" },
		{ mastery: "atraencia" },
	];
}
