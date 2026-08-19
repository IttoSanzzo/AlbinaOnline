import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./CampaignCard.module.css";
import { Campaign, CampaignTypeName } from "@/libs/stp@types";
import Image from "next/image";
import { PhosphorKey, StpIcon } from "@/libs/stp@icons";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { Tilt } from "@/components/(Design)";
import Link from "next/link";

const CampaignCardContainer = newStyledElement.div(
	styles.campaignCardContainer,
);
const CampaignBannerContainer = newStyledElement.div(
	styles.campaignBannerContainer,
);
const CampaignIconContainer = newStyledElement.div(
	styles.campaignIconContainer,
);
const CampaignFootContainer = newStyledElement.div(
	styles.campaignFootContainer,
);
const PlayerCounter = newStyledElement.div(styles.playerCounter);
const MasterCounter = newStyledElement.div(styles.masterCounter);
const TypeDisplay = newStyledElement.div(styles.typeDisplay);
const TitleContainer = newStyledElement.div(styles.titleContainer);

interface CampaignCardProps {
	campaign: Campaign;
	isMember?: boolean;
}
export function CampaignCard({
	campaign,
	isMember = false,
}: CampaignCardProps) {
	const playerCountColor: keyof typeof StandartTextColor =
		campaign.maxPlayers == 0 || campaign.playerCount < campaign.maxPlayers
			? "green"
			: "red";

	const hourglass: PhosphorKey =
		campaign.type == "Indefinite"
			? "Hourglass"
			: campaign.type == "Long"
				? "HourglassHigh"
				: campaign.type == "Short"
					? "HourglassMedium"
					: campaign.type == "OneShot"
						? "HourglassLow"
						: "HourglassSimple";

	return (
		<Tilt
			options={{
				reverse: true,
				max: 15,
			}}>
			<Link href={`/campanhas/${campaign.slug}`}>
				<CampaignCardContainer>
					<CampaignBannerContainer>
						<Image
							src={campaign.bannerUrl}
							alt={""}
							width={350}
							height={150}
						/>
					</CampaignBannerContainer>
					<CampaignIconContainer>
						<Image
							src={campaign.iconUrl}
							alt={""}
							width={70}
							height={70}
						/>
					</CampaignIconContainer>
					<TitleContainer>
						<h4>{campaign.name}</h4>
					</TitleContainer>
					<CampaignFootContainer>
						<MasterCounter>
							<StpIcon
								name="Feather"
								style="bold"
								color={"purple"}
							/>
							<UIBasics.Text
								textColor={"purple"}
								withBold>
								{campaign.masterCount.toString()}
							</UIBasics.Text>
						</MasterCounter>
						<PlayerCounter>
							<StpIcon
								name="GameController"
								style="bold"
								color={playerCountColor}
							/>
							<UIBasics.Text
								textColor={playerCountColor}
								withBold>
								{`${campaign.playerCount}${campaign.maxPlayers == 0 ? "" : ` / ${campaign.masterCount}`}`}
							</UIBasics.Text>
						</PlayerCounter>
						<TypeDisplay>
							<StpIcon
								name={hourglass}
								style="bold"
								color={"blue"}
							/>
							<UIBasics.Text
								textColor={"blue"}
								withBold>
								{CampaignTypeName[campaign.type]}
							</UIBasics.Text>
						</TypeDisplay>
					</CampaignFootContainer>
				</CampaignCardContainer>
			</Link>
		</Tilt>
	);
}
