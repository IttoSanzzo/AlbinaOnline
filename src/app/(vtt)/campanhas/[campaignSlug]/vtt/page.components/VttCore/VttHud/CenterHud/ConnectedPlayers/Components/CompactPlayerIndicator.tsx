import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./CompactPlayerIndicator.module.css";
import { CampaignMember, CharacterCoreMetrics, Guid } from "@/libs/stp@types";
import { useVttVoiceStore } from "../../../../../Contexts/VttVoiceContextProvider";
import { useVttTokenStore } from "../../../../../Stores/VttTokenStore";
import { BasicMedia } from "@/components/(Design)/components/BasicMedia";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { VttTokenImageRenderer } from "../../../../VttBoard/TokenBoardLayer/VttTokenImageRenderer";
import { useVttContext } from "../../../../../Contexts/VttContextProvider";
import { useVttThrottledViewportContext } from "../../../../../Contexts/VttThrottledViewportContext";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../../../Utils/ElementDataAttributeUtils";
import { useVttMembersContext } from "../../../../../Contexts/VttMembersProvider";
import clsx from "clsx";
import { VttToken } from "../../../../../Types/Classes/VttToken";
import { useEffect, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";

const CompactPlayerIndicatorContainer = newStyledElement.div(
	styles.compactPlayerIndicatorContainer,
);
const ImageContainer = newStyledElement.div(styles.imageContainer);

interface CompactPlayerIndicatorProps {
	member: CampaignMember;
}
export function CompactPlayerIndicator({
	member,
}: CompactPlayerIndicatorProps) {
	const token = useVttTokenStore((store) =>
		store.tokens.get(Guid.Empty as Guid),
	);
	const isConnected = useVttMembersContext((state) =>
		state.connectedUserIds.has(member.userId),
	);
	const activeLayerId = useVttContext((state) => state.activeSceneId);
	const animateCamera = useVttThrottledViewportContext(
		(state) => state.animateCamera,
		1500,
	);

	return (
		<CompactPlayerIndicatorContainer
			title={`${member.user.nickname} (${isConnected ? "Conectado" : "Desconectado"})\n\n${member.isMaster ? "Mestre" : "Jogador"}`}
			className={isConnected ? styles.isConnected : undefined}
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
			<ImageContainer className={member.isMaster ? styles.isMaster : undefined}>
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
			</ImageContainer>
			<VoiceStateIndicator userId={member.userId} />
			{token && <GaugesIndicator token={token} />}
		</CompactPlayerIndicatorContainer>
	);
}

const VoiceStateIndicatorElement = newStyledElement.span(
	styles.voiceStateIndicatorElement,
);
interface VoiceStateIndicatorProps {
	userId: Guid;
}
function VoiceStateIndicator({ userId }: VoiceStateIndicatorProps) {
	const voiceState = useVttVoiceStore((state) => state.getVoiceState(userId));

	if (!voiceState) return null;
	return (
		<VoiceStateIndicatorElement
			className={clsx(
				voiceState.inCall ? styles.inCall : styles.notInCall,
				voiceState.speaking && styles.speaking,
				voiceState.muted && styles.muted,
				voiceState.deafened && styles.deafened,
			)}
		/>
	);
}

const GaugesIndicatorContainer = newStyledElement.div(
	styles.gaugesIndicatorContainer,
);
interface GaugePercentages {
	hp: number;
	mp: number;
	ep: number;
}
interface GaugesIndicatorProps {
	token: VttToken;
}
function GaugesIndicator({ token }: GaugesIndicatorProps) {
	const [gaugePercentages, setGaugePercentages] = useState<GaugePercentages>({
		hp: 100,
		mp: 100,
		ep: 100,
	});

	useEffect(() => {
		if (
			token.type != "Character" ||
			!token.targetId ||
			token.targetId == ("" as Guid) ||
			token.targetId == "00000000-0000-0000-0000-000000000000"
		)
			return;
		async function updateGaugePercentages() {
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
	}, [token.type, token.targetId, gaugePercentages]);

	const hpPercentage = gaugePercentages.hp;
	const mpPercentage = gaugePercentages.mp;
	const epPercentage = gaugePercentages.ep;

	return (
		<GaugesIndicatorContainer>
			<GaugeIndicator
				percentage={hpPercentage}
				type={"HP"}
			/>
			<GaugeIndicator
				percentage={mpPercentage}
				type={"MP"}
			/>
			<GaugeIndicator
				percentage={epPercentage}
				type={"EP"}
			/>
		</GaugesIndicatorContainer>
	);
}

const GaugeIndicatorContainer = newStyledElement.div(
	styles.gaugeIndicatorContainer,
);
interface GaugeIndicatorProps {
	percentage: number;
	type: "HP" | "EP" | "MP";
}
const GAUGE_CONFIGURATIONS = {
	MP: {
		color: "#3b82f6",
		startAngle: 0,
		isClockwise: false,
	},
	HP: {
		color: "#b91c1c",
		startAngle: 120,
		isClockwise: false,
	},
	EP: {
		color: "#0f766e",
		startAngle: 240,
		isClockwise: true,
	},
} as const;
function GaugeIndicator({ percentage, type }: GaugeIndicatorProps) {
	const configuration = GAUGE_CONFIGURATIONS[type];

	const normalizedPercentage = Math.min(100, Math.max(0, percentage));
	const progress = normalizedPercentage;

	const radius = 45;
	const circumference = 2 * Math.PI * radius;
	const segmentLength = circumference / 3;

	const startOffset = (configuration.startAngle / 360) * circumference;

	return (
		<GaugeIndicatorContainer>
			<svg
				viewBox={"0 0 96 96"}
				className={styles.gaugeIndicator}>
				<circle
					cx={48}
					cy={48}
					r={radius}
					fill={"none"}
					stroke={"#292929"}
					strokeWidth={6}
					strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
					strokeDashoffset={-startOffset}
					strokeLinecap={"round"}
					transform={"rotate(-90 48 48)"}
				/>
				<circle
					cx={48}
					cy={48}
					r={radius}
					fill={"none"}
					stroke={configuration.color}
					strokeWidth={4}
					strokeDasharray={`${(segmentLength * progress) / 100} ${circumference}`}
					strokeDashoffset={
						-startOffset -
						(configuration.isClockwise
							? 0
							: segmentLength - (segmentLength * progress) / 100)
					}
					strokeLinecap={"round"}
					transform={"rotate(-90 48 48)"}
					className={styles.gaugeIndicatorProgress}
				/>
			</svg>
		</GaugeIndicatorContainer>
	);
}
