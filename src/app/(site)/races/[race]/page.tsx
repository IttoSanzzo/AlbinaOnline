import GenericPageContainer from "@/components/(Design)/GenericPageContainer/componentIndex";
import NotionText from "@/components/(NotionBased)/NotionText/componentIndex";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import {
	NotionBackgroundColor,
	NotionTextColor,
} from "@/utils/NotionBasedUtils";
import NotionHeader from "@/components/(NotionBased)/NotionHeader/componentIndex";
import NotionCallout from "@/components/(NotionBased)/NotionCallout/componentIndex";

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

			<NotionCallout
				icon={AlbinaLogo}
				title={
					<NotionText
						textColor={NotionTextColor.Red}
						withUnderline={true}>
						⫷Tipologia⫸
					</NotionText>
				}>
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
				<NotionCallout
					backgroundColor={NotionBackgroundColor.Yellow}
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
