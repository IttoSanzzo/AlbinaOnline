import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const EmbedContainer = newStyledElement.div(styles.embedContainer);
const BotSide = newStyledElement.div(styles.botSide);
const BotImage = newStyledElement.div(styles.botImage);
const TrackImage = newStyledElement.div(styles.trackImage);
const MusicInfoContainer = newStyledElement.div(styles.musicInfoContainer);

interface MusicBotsEmbedProps {
	serverId: string;
}
export function MusicBotsEmbed({ serverId }: MusicBotsEmbedProps) {
	return (
		<EmbedContainer>
			<BotSide className={styles.leftSide}>
				<BotImage>
					<div>
						<iframe
							src={`https://reactive.fugi.tech/individual/1070103829934260344`}
						/>
					</div>
				</BotImage>
				<MusicInfoContainer>
					<iframe
						className={styles.seekEmbed}
						src={`https://gjallarhorncontrol.setsu.party/embeds/ChariotSanzzo/${serverId}/seekbar`}
					/>
					<iframe
						className={styles.titleEmbed}
						src={`https://gjallarhorncontrol.setsu.party/embeds/ChariotSanzzo/${serverId}/current-track`}
					/>
				</MusicInfoContainer>
				<TrackImage>
					<div>
						<iframe
							src={`https://gjallarhorncontrol.setsu.party/embeds/ChariotSanzzo/${serverId}/peek`}
						/>
					</div>
				</TrackImage>
			</BotSide>
			<BotSide className={styles.rightSide}>
				<BotImage>
					<div>
						<iframe
							src={`https://reactive.fugi.tech/individual/1273070668451418122`}
						/>
					</div>
				</BotImage>
				<MusicInfoContainer>
					<iframe
						className={styles.seekEmbed}
						src={`https://gjallarhorncontrol.setsu.party/embeds/Gjallarhorn/${serverId}/seekbar`}
					/>
					<iframe
						className={styles.titleEmbed}
						src={`https://gjallarhorncontrol.setsu.party/embeds/Gjallarhorn/${serverId}/current-track`}
					/>
				</MusicInfoContainer>
				<TrackImage>
					<div>
						<iframe
							src={`https://gjallarhorncontrol.setsu.party/embeds/Gjallarhorn/${serverId}/peek`}
						/>
					</div>
				</TrackImage>
			</BotSide>
		</EmbedContainer>
	);
}
