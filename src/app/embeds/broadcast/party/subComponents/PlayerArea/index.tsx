import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { CharacterProfileEmbed } from "@/app/embeds/chars/[charId]/profile/subComponents/CharacterProfileEmbed";
import { BroadcastPartyMemberSettings } from "../../page";

const PlayersAreaContainer = newStyledElement.div(styles.playersAreaContainer);
const PlayerGrid = newStyledElement.div(styles.playerGrid);

interface PlayersAreaProps {
	players: BroadcastPartyMemberSettings[];
}
export function PlayersArea({ players }: PlayersAreaProps) {
	const count = players.length;
	const columns = Math.ceil(Math.sqrt(count));
	const rows = Math.ceil(count / columns);

	players = players.slice(0, 6);
	return (
		<PlayersAreaContainer>
			<PlayerGrid
				style={{
					gridTemplateColumns: `repeat(${columns}, 1fr)`,
					gridTemplateRows: `repeat(${rows}, 1fr)`,
				}}>
				{players.map((player, index) => (
					<CharacterProfileEmbed
						key={index}
						charId={player.characterId}
						reactiveId={player.discordId}
						title={player.title}
						fontSize="1vw"
						useLargeSideBars
						priorizeVerticalSize
						size={"100%"}
					/>
				))}
			</PlayerGrid>
		</PlayersAreaContainer>
	);
}
