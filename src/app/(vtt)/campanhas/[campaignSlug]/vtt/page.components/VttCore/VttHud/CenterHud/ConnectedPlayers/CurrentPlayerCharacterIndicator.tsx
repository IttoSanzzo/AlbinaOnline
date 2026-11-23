import { CampaignMember, CharacterCoreMetrics, Guid } from "@/libs/stp@types";
import styles from "./CurrentPlayerCharacterIndicator.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useVttThrottledViewportContext } from "../../../../Contexts/VttThrottledViewportContext";
import { useVttContext } from "../../../../Contexts/VttContextProvider";
import { useVttTokenStore } from "../../../../Stores/VttTokenStore";
import { VttToken } from "../../../../Types/Classes/VttToken";
import { useVttVoiceStore } from "../../../../Contexts/VttVoiceContextProvider";
import clsx from "clsx";
import { VttTokenImageRenderer } from "../../../VttBoard/TokenBoardLayer/VttTokenImageRenderer";
import { BasicMedia } from "@/components/(Design)/components/BasicMedia";
import { CSSProperties, useEffect, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../../Utils/ElementDataAttributeUtils";

const CurrentPlayerCharacterIndicatorContainer = newStyledElement.div(
	styles.currentPlayerCharacterIndicatorContainer,
);
const ImageContainer = newStyledElement.div(styles.imageContainer);

interface CurrentPlayerCharacterIndicatorProps {
	member: CampaignMember;
}
export function CurrentPlayerCharacterIndicator({
	member,
}: CurrentPlayerCharacterIndicatorProps) {
	const token = useVttTokenStore((state) =>
		state.tokens.get(Guid.Empty as Guid),
	);

	return (
		<CurrentPlayerCharacterIndicatorContainer>
			<ImageRenderer
				member={member}
				token={token}
			/>
			<CharacterInfo token={token} />
		</CurrentPlayerCharacterIndicatorContainer>
	);
}

const VoiceStateIndicatorElement = newStyledElement.span(
	styles.voiceStateIndicatorElement,
);
interface ImageRendererProps {
	member: CampaignMember;
	token: VttToken | undefined;
}
function ImageRenderer({ member, token }: ImageRendererProps) {
	const activeLayerId = useVttContext((state) => state.activeSceneId);
	const animateCamera = useVttThrottledViewportContext(
		(state) => state.animateCamera,
		1500,
	);
	const voiceState = useVttVoiceStore((state) =>
		state.getVoiceState(member.userId),
	);

	return (
		<ImageContainer
			{...setVttElementDataAttributes(
				VttElementDataAttribute.EventPing,
				VttElementDataAttribute.EventZoom,
				VttElementDataAttribute.EventMiddleButtonPan,
			)}
			onClick={() => {
				if (!token) return;
				const position = token.placements.get(activeLayerId ?? Guid.Empty);
				if (!position) return;
				animateCamera({
					position,
				});
			}}>
			{token ? (
				<VttTokenImageRenderer
					vttTokenId={token.id}
					objectFit={"Contain"}
				/>
			) : (
				<BasicMedia
					src={member.user.iconUrl}
					alt={`${member.user.nickname}'s Icon`}
					fill
				/>
			)}
			{voiceState && (
				<VoiceStateIndicatorElement
					className={clsx(
						voiceState.inCall ? styles.inCall : styles.notInCall,
						voiceState.speaking && styles.speaking,
						voiceState.muted && styles.muted,
						voiceState.deafened && styles.deafened,
					)}
				/>
			)}
		</ImageContainer>
	);
}

const CharacterInfoContainer = newStyledElement.div(
	styles.characterInfoContainer,
);
const CharacterName = newStyledElement.p(styles.characterName);
interface GaugePercentages {
	hp: number;
	mp: number;
	ep: number;
}
interface CharacterInfoProps {
	token?: VttToken;
}
function CharacterInfo({ token }: CharacterInfoProps) {
	const [gaugePercentages, setGaugePercentages] = useState<GaugePercentages>({
		hp: 100,
		mp: 100,
		ep: 100,
	});

	useEffect(() => {
		if (
			!token ||
			token.type != "Character" ||
			!token.targetId ||
			token.targetId == ("" as Guid) ||
			token.targetId == "00000000-0000-0000-0000-000000000000"
		)
			return;
		async function updateGaugePercentages() {
			if (!token) return;
			const response = await authenticatedFetchAsync(
				getAlbinaApiFullAddress(`/chars/${token.targetId}/core-metrics`),
				{
					method: "GET",
				},
			);
			if (response.ok == false) return;
			const data: CharacterCoreMetrics = await response.json();
			const newGaugePercentages: GaugePercentages = {
				hp: Math.ceil(
					data.healthPoints.effectiveMax > 0
						? (data.healthPoints.effectiveCurrent /
								data.healthPoints.effectiveMax) *
								100
						: 0,
				),
				mp: Math.ceil(
					data.manaPoints.effectiveMax > 0
						? (data.manaPoints.effectiveCurrent /
								data.manaPoints.effectiveMax) *
								100
						: 0,
				),
				ep: Math.ceil(
					data.staminaPoints.effectiveMax > 0
						? (data.staminaPoints.effectiveCurrent /
								data.staminaPoints.effectiveMax) *
								100
						: 0,
				),
			};
			if (
				newGaugePercentages.hp != gaugePercentages.hp ||
				newGaugePercentages.mp != gaugePercentages.mp ||
				newGaugePercentages.ep != gaugePercentages.ep
			)
				setGaugePercentages(newGaugePercentages);
		}
		const interval = setInterval(updateGaugePercentages, 3000);
		updateGaugePercentages();
		return () => clearInterval(interval);
	}, [token, gaugePercentages]);

	const hpPercentage = gaugePercentages.hp;
	const epPercentage = gaugePercentages.ep;
	const mpPercentage = gaugePercentages.mp;

	if (!token)
		return (
			<CharacterInfoContainer className={styles.withoutToken}>
				Sem Token
			</CharacterInfoContainer>
		);
	return (
		<CharacterInfoContainer>
			<CharacterName>Hirone S</CharacterName>
			<GaugeBar
				percentage={hpPercentage}
				color={"var(--cl-red-700)"}
			/>
			<GaugeBar
				percentage={epPercentage}
				color={"var(--cl-green-700)"}
			/>
			<GaugeBar
				percentage={mpPercentage}
				color={"var(--cl-blue-700)"}
			/>
		</CharacterInfoContainer>
	);
}

const GaugeBarContainer = newStyledElement.div(styles.gaugeBarContainer);
const GaugeBarElement = newStyledElement.span(styles.gaugeBarElement);
interface GaugeBarProps {
	percentage: number;
	color: CSSProperties["backgroundColor"];
}
function GaugeBar({ percentage, color }: GaugeBarProps) {
	const finalPercentage = Math.min(Math.max(percentage, 0), 100);
	return (
		<GaugeBarContainer>
			<GaugeBarElement
				style={{
					width: `calc(${finalPercentage}% - 2px)`,
					backgroundColor: color,
				}}
			/>
		</GaugeBarContainer>
	);
}
