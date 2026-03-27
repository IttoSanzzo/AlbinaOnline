import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import "./styles.css";
import { CharacterProfileEmbed } from "../../chars/[charId]/profile/subComponents/CharacterProfileEmbed";
import { Guid } from "@/libs/stp@types";
import { PlayersArea } from "./subComponents/PlayerArea";
import { DiscordChannelEmbed } from "./subComponents/DiscordChannelEmbed";
import { MusicBotsEmbed } from "./subComponents/MusicBotsEmbed";

export interface BroadcastPartyMemberSettings {
	discordId?: string;
	title?: string;
	characterId: Guid;
}
export interface BroadcastPartySettings {
	serverId: string;
	diceChannelId: string;
	voiceChannelId: string;
	secretVoiceChannelId?: string;
	master: BroadcastPartyMemberSettings;
	players: BroadcastPartyMemberSettings[];
	bossId?: string;
	localSlug?: string;
}

const settings: BroadcastPartySettings = {
	serverId: "570314631214661632",
	diceChannelId: "756752942085963847",
	voiceChannelId: "756752724376420382",
	secretVoiceChannelId: "1286813623058038859",
	master: {
		characterId: "f77d729a-0eb6-45f9-9e12-95fb157698f9" as Guid,
		discordId: "301498447088058368",
		title: "Hirone Sanzzo",
	},
	players: [
		{
			characterId: "64a7d1ae-7978-4524-8bba-97e530fda35e" as Guid,
			discordId: "565302438811140097",
			title: "Katrina Sanzzo",
		},
		{
			characterId: "861e259f-2b75-4f34-ad20-92f5696350da" as Guid,
			discordId: "717210353234214982",
			title: "Ruby Hankasu",
		},
		{
			characterId: "b84827c7-39df-48e7-9aa7-d6dc54e6fa61" as Guid,
			discordId: "906685666300133386",
			title: "Zacarias",
		},
		{
			characterId: "92dd7a8f-3303-4b9f-bcc3-970e3891a71e" as Guid,
			discordId: "903012637665804340",
			title: "Ayumu",
		},
		{
			characterId: "" as Guid,
			discordId: undefined,
			title: undefined,
		},
		{
			characterId: "" as Guid,
			discordId: undefined,
			title: undefined,
		},
	],
};

const PageContainer = newStyledElement.div(styles.pageContainer);
const LeftContainer = newStyledElement.div(styles.leftContainer);
const MiddleContainer = newStyledElement.div(styles.middleContainer);
const RightContainer = newStyledElement.div(styles.rightContainer);
const DiscordContainer = newStyledElement.div(styles.discordContainer);
const MasterContainer = newStyledElement.div(styles.masterContainer);

interface PageProps {
	searchParams: Promise<{
		id?: string;
	}>;
}
export default async function ({ searchParams }: PageProps) {
	const { id = "main" } = await searchParams;
	console.log(id);

	return (
		<PageContainer>
			<LeftContainer>
				<DiscordContainer>
					<DiscordChannelEmbed
						serverId={settings.serverId}
						channelId={settings.diceChannelId}
					/>
				</DiscordContainer>
				<MasterContainer>
					<CharacterProfileEmbed
						charId={settings.master.characterId}
						reactiveId={settings.master.discordId}
						title={settings.master.title}
						fontSize="2vw"
						invertReactive
						useLargeSideBars
					/>
				</MasterContainer>
			</LeftContainer>
			<MiddleContainer>
				<MusicBotsEmbed serverId={settings.serverId} />
				<div
					style={{
						display: "flex",
						flexGrow: 1,
					}}
				/>
				<PlayersArea players={settings.players} />
			</MiddleContainer>
			<RightContainer></RightContainer>
		</PageContainer>
	);
}
