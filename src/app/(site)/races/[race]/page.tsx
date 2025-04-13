import GenericPageContainer from "@/components/(Design)/GenericPageContainer";
import NotionText from "@/components/(NotionBased)/NotionText";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import {
	NotionBackgroundColor,
	NotionTextColor,
} from "@/utils/NotionBasedUtils";
import NotionHeader from "@/components/(NotionBased)/NotionHeader";
import NotionCallout from "@/components/(NotionBased)/NotionCallout";
import Notion2Columns from "@/components/(NotionBased)/Notion2Columns";
import NotionToggle from "@/components/(NotionBased)/NotionToggle";
import NotionQuote from "@/components/(NotionBased)/NotionQuote";

interface RaceData {
	name: string;
}

interface RaceProps {
	params: Promise<{ race: string }>;
}

export default async function Race({ params }: RaceProps) {
	const { race } = await params;
	console.log(race);

	return (
		<GenericPageContainer
			title={`Raça - ${race}`}
			banner={AlbinaLogo}
			favicon={AlbinaLogo}>
			<NotionHeader
				textColor={NotionTextColor.Orange}
				backgroundColor={NotionBackgroundColor.Gray}
				withUnderline={true}
				textAlign="center">
				🏮Informações Gerais🏮
			</NotionHeader>

			<NotionToggle
				title={<>Banana</>}
				backgroundColor={NotionBackgroundColor.Gray}
				textColor={NotionTextColor.Blue}>
				Nuttela
			</NotionToggle>
			<NotionToggle
				title={<>Banana</>}
				backgroundColor={NotionBackgroundColor.Gray}>
				Nuttela
			</NotionToggle>

			<NotionQuote backgroundColor={NotionBackgroundColor.Gray}>
				Quote
				<NotionQuote backgroundColor={NotionBackgroundColor.Gray}>
					Quote
					<NotionQuote backgroundColor={NotionBackgroundColor.Gray}>
						Quote
					</NotionQuote>
				</NotionQuote>
			</NotionQuote>

			<NotionCallout
				icon={AlbinaLogo}
				title={
					<NotionText
						textColor={NotionTextColor.Red}
						withUnderline={true}>
						⫷Tipologia⫸
					</NotionText>
				}>
				<Notion2Columns
					divisionRatio={0}
					colum1={
						<NotionCallout
							backgroundColor={NotionBackgroundColor.Pink}
							icon={AlbinaLogo}
							title={
								<NotionText
									textColor={NotionTextColor.Red}
									withItalic={true}
									withUnderline={true}>
									💮Árvore:
								</NotionText>
							}>
							Hello
						</NotionCallout>
					}
					colum2={
						<NotionCallout
							backgroundColor={NotionBackgroundColor.Pink}
							icon={AlbinaLogo}
							title={
								<NotionText
									textColor={NotionTextColor.Red}
									withUnderline={true}>
									🏵️Relação:
								</NotionText>
							}>
							Hello
						</NotionCallout>
					}
					// justifyContent1="right"
					// justifyContent2="left"
				/>
			</NotionCallout>

			<NotionText textColor={NotionTextColor.Yellow}>
				Fada <NotionText textColor={NotionTextColor.Blue}>Azul</NotionText>
			</NotionText>
			<NotionText textColor={NotionTextColor.Yellow}>
				Fada <NotionText textColor={NotionTextColor.Blue}>Azul</NotionText>
			</NotionText>
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
