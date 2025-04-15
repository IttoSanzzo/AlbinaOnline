import GenericPageContainer from "@/components/(Design)/GenericPageContainer";
import NotionText from "@/components/(NotionBased)/NotionText";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import NotionHeader from "@/components/(NotionBased)/NotionHeader";
import NotionCallout from "@/components/(NotionBased)/NotionCallout";
import Notion2Columns from "@/components/(NotionBased)/Notion2Columns";
import NotionToggle from "@/components/(NotionBased)/NotionToggle";
import NotionQuote from "@/components/(NotionBased)/NotionQuote";
import NotionTable, {
	NotionTableData,
} from "@/components/(NotionBased)/NotionTable";
import { StpIcon } from "@/../libs/stp@icons";
import NotionDivisor from "@/components/(NotionBased)/NotionDivisor";

interface RaceData {
	name: string;
}

interface RaceProps {
	params: Promise<{ race: string }>;
}

export default async function Race({ params }: RaceProps) {
	const { race } = await params;
	// console.log(race);

	// const tableTest: NotionTableData = {
	// 	tableLanes: [
	// 		[<>Vitalidade</>, <>🔸</>, <>🔸</>],
	// 		[<>Vigor</>, <>🔸</>, <>🔸</>],
	// 		[<>Manapool</>, <>10</>, <>🔸</>],
	// 		[<>Poder Fisico</>, <>🔸</>, <>🔸</>],
	// 		[<>Poder Magico</>, <>🔻</>, <>🔸</>],
	// 	],
	// };

	return (
		<GenericPageContainer
			title={`Raça - ${race}`}
			banner={AlbinaLogo}
			favicon={AlbinaLogo}>
			<NotionHeader
				textColor={"orange"}
				backgroundColor={"gray"}
				withUnderline={true}
				textAlign="center">
				🏮Informações Gerais🏮
			</NotionHeader>

			<NotionCallout
				icon={{ name: "Shuffle", color: "purple" }}
				title={<NotionText textColor="red">⫷Tipologia⫸</NotionText>}>
				<Notion2Columns
					colum1={
						<NotionCallout
							icon={{ name: "TreeEvergreen", color: "pink" }}
							backgroundColor="pink"
							title={<NotionText textColor="pink">💮Árvore:</NotionText>}>
							<NotionText
								textColor="pink"
								withBold
								withItalic>
								》Feéricos
							</NotionText>
						</NotionCallout>
					}
					colum2={
						<NotionCallout
							icon={{ name: "TreeEvergreen", color: "yellow" }}
							backgroundColor="yellow"
							title={<NotionText textColor="yellow">🏵️Relação:</NotionText>}>
							<NotionText
								textColor="yellow"
								withBold
								withItalic>
								》Raça principal
							</NotionText>
						</NotionCallout>
					}
				/>
			</NotionCallout>

			<NotionCallout
				icon={{ name: "Cards", color: "red" }}
				title={<NotionText textColor="red">⫷Informações Gerais⫸</NotionText>}>
				<NotionDivisor />
				<NotionCallout
					icon={{ name: "BookOpen", color: "yellow", style: "fill" }}
					title={
						<NotionText textColor="yellow">
							Cultura, Comunidade e Curiosidades..:
						</NotionText>
					}>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								Cultura, Comunidade e Curiosidades..:
							</NotionText>
						}>
						<NotionDivisor />
						<NotionCallout
							icon={{ name: "Sparkle", color: "orange" }}
							title={<NotionText>“Amados pela mana”</NotionText>}
						/>
						<NotionQuote textColor="default">
							Fadas são uma das raças primordiais, e aquela com a maior
							abundancia de mana em seus corpos. Claro, quantidade não quer
							dizer potencia, mas no que diz respeito ao elo com a mana, talvez
							não haja outra que chegue aos pés.
						</NotionQuote>
						<NotionQuote textColor="default">
							São uma raça alada e que possui no geral, um forte senso de
							liberdade e aventura. Elas possuem uma vida ligeiramente longa, em
							relação aos humanos, e uma sociedade muito mais estável e coerente
							em sua terra natal, fazendo com que fadas no geral sejam uma raça
							de… vida abençoada, ou era pra ser pelo menos.
						</NotionQuote>
						<NotionQuote textColor="default">
							Em um aspecto geral, é uma raça que não costuma ter contato com as
							demais, e objetivamente, não há nada como uma conexão em larga
							escala da sua sociedade central, para com os povos de outras
							raças. Bem, não é como se houvesse muitas oportunidades para isso
							de qualquer maneira.
						</NotionQuote>
						<NotionDivisor />
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Personalidade Comum
							</NotionText>
						}>
						<NotionDivisor />
						<NotionQuote textColor="default">
							Fadas são caixinhas de surpresa, nunca se sabe.
						</NotionQuote>
						<NotionQuote textColor="default">
							Elas podem possuir esse forte senso de liberdade, mas isso não
							significa que sejam idiotas aventureiros no geral. Elas apenas
							possuem… um elo mais profundo com o mundo, do que a maioria.
						</NotionQuote>
						<NotionDivisor />
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Traços de Cultura
							</NotionText>
						}>
						<NotionDivisor />
						<NotionQuote textColor="default">
							As fadas possuem uma profunda e rica cultura e historia, fundada
							no desenvolvimento de sua sociedade como um todo, e que conserva
							bem os contos dos tempo antigos, do que seria tido como a Era
							Primordial.
						</NotionQuote>
						<NotionDivisor />
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Miscelâneas
							</NotionText>
						}>
						<NotionDivisor />
						<NotionQuote textColor="default"></NotionQuote>
						<NotionDivisor />
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Palheta de Agremiações
							</NotionText>
						}>
						<NotionDivisor />
						<NotionQuote textColor="default"></NotionQuote>
						<NotionDivisor />
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Relacionamento Interracial
							</NotionText>
						}>
						<NotionDivisor />
						<NotionQuote textColor="default">
							Fadas possuem uma sociedade relativamente pacífica para com elas
							próprias, e dessa forma, fadas no geral tendem a se dar bem.
							Claro, existem certas divisões, muitas vezes pela essência da mana
							de cada um, mas aí, são casos e casos, e geralmente coletivos de
							uma região.
						</NotionQuote>
						<NotionQuote textColor="default">
							Fadas são adoradas e muito bem queridas no geral, por todos os
							povos que partilham de sangue élfico.
						</NotionQuote>
						<NotionQuote textColor="default">
							Fadas possuem uma relação muuuuuuuuuito complicada com humanos.
						</NotionQuote>
						<NotionQuote textColor="default">
							Fadas possuem uma relação neutra-ok, com todo o resto basicamente.
						</NotionQuote>
						<NotionDivisor />
					</NotionToggle>
				</NotionCallout>
				<NotionCallout
					icon={{ name: "BookOpen", color: "yellow", style: "fill" }}
					title={
						<NotionText textColor="yellow">
							Aparência e Fisiologia..:
						</NotionText>
					}>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Descrição
							</NotionText>
						}>
						<NotionDivisor />
						<NotionQuote textColor="default">
							Fadas possuem forma humanoide, e tamanho extremamente próximo ao
							dos humanos. Seres dessa raça são dotados de orelhas levemente à
							extremamente pontudas, por muitas vezes arqueadas para baixo.
						</NotionQuote>
						<NotionQuote textColor="default">
							Elas também possuem asas, como uma forma de “órgão”, vital para
							sua existência, de aparência translúcida, e aspecto etéreo. Estas
							podem ser “retraídas” para dentro de seus corpos, são muitas vezes
							ilustradas de belos padrões desenhados naturalmente.
						</NotionQuote>
						<NotionQuote textColor="default">
							Também não é incomum que fadas possuam cabelo “colorido”,
							geralmente de acordo com sua essência feérica, apesar de não ser
							uma regra absoluta.
						</NotionQuote>
						<NotionQuote textColor="default">
							Exceto por esses detalhes, não existem realmente muitas
							características físicas que as diferenciam dos seres humanos,
							visualmente falando para os olhos comuns, claro.
						</NotionQuote>
						<NotionDivisor />
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Imagens
							</NotionText>
						}>
						<NotionDivisor />
						<NotionQuote textColor="default"></NotionQuote>
						<NotionDivisor />
					</NotionToggle>
				</NotionCallout>
			</NotionCallout>
		</GenericPageContainer>
	);
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return [
		{ race: "humano" },
		{ race: "bestial" },
		{ race: "pequenino" },
		{ race: "dwarf" },
		{ race: "halbelf" },
		{ race: "maketsu" },
		{ race: "alarion" },
		{ race: "draknir" },
		{ race: "fada" },
		{ race: "hochelf" },
		{ race: "mondelf" },
		{ race: "sonnelf" },
		{ race: "dokkalfar" },
		{ race: "waldelf" },
		{ race: "zwergelf" },
		{ race: "faedra" },
		{ race: "tita" },
		{ race: "troll" },
		{ race: "dragao-verdadeiro" },
		{ race: "wyvern" },
		{ race: "wyrm" },
		{ race: "drake" },
		{ race: "draconato" },
		{ race: "demonio-puro" },
		{ race: "ogro" },
		{ race: "oni" },
		{ race: "imp" },
		{ race: "nephilim" },
		{ race: "anjo-puro" },
		{ race: "platenario" },
		{ race: "empirico" },
		{ race: "ljosalfar" },
		{ race: "sishen" },
		{ race: "deva" },
		{ race: "licht" },
		{ race: "kiishu" },
		{ race: "fitopheles" },
		{ race: "demen" },
		{ race: "seirei" },
		{ race: "driade" },
		{ race: "feral" },
		{ race: "nezhit" },
		{ race: "vampiro-verdadeiro" },
		{ race: "espectro" },
		{ race: "takroiy" },
		{ race: "nekri" },
		{ race: "lich" },
		{ race: "goblin" },
	];
}
