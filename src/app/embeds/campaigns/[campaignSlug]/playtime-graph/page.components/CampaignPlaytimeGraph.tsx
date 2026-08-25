"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./CampaignPlaytimeGraph.module.css";
import { useEffect, useState } from "react";
import {
	Campaign,
	CampaignMember,
	CampaignSessionDay,
	Guid,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { PlaytimeGraph } from "./PlaytimeGraph";

const CampaignPlaytimeGraphContainer = newStyledElement.div(
	styles.campaignPlaytimeGraphContainer,
);
const YearSelectorContainer = newStyledElement.div(
	styles.yearSelectorContainer,
);
const YearSelector = newStyledElement.button(styles.yearSelector);
const LeftContainer = newStyledElement.div(styles.leftContainer);
const HeaderContainer = newStyledElement.div(styles.headerContainer);

const PLAYTIME_COLORS = {
	teal: "#2dd4bf",
	purple: "#c084fc",
	blue: "#60a5fa",
	darkBlue: "#18556F",
	green: "#4ade80",
	yellow: "#facc15",
	red: "#f87171",
	pink: "#f472b6",
	orange: "#fb923c",
} as const;

export type PlaytimeColor = keyof typeof PLAYTIME_COLORS;

type PlaytimeGraphStyle = React.CSSProperties & {
	"--playtime-color": string;
};

export interface CampaignPlaytimeGraphProps {
	campaignSlug: string;
	year?: number;
	targetUserId?: Guid;
	headerColor?: PlaytimeColor;
	graphColor?: PlaytimeColor;
}
export function CampaignPlaytimeGraph({
	campaignSlug,
	year: defaultYear,
	targetUserId,
	headerColor = "teal",
	graphColor = "teal",
}: CampaignPlaytimeGraphProps) {
	const [year, setYear] = useState<number>(
		defaultYear ?? new Date().getFullYear(),
	);
	const [campaign, setCampaign] = useState<Campaign | null>(null);
	const [sessionDays, setSessionDays] = useState<CampaignSessionDay[] | null>(
		null,
	);
	const [members, setMembers] = useState<CampaignMember[] | null>(null);

	useEffect(() => {
		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress(`/campaigns/${campaignSlug}`),
			);

			if (!response.ok) return;

			setCampaign(await response.json());
		})();
	}, [campaignSlug]);
	useEffect(() => {
		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress(
					`/campaigns/${campaignSlug}/playtime?year=${year}`,
				),
			);

			if (!response.ok) return;

			setSessionDays(await response.json());
		})();
	}, [campaignSlug, year]);
	useEffect(() => {
		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress(
					`/campaigns/${campaignSlug}/members?expandUser=true`,
				),
			);

			if (!response.ok) return;

			setMembers(await response.json());
		})();
	}, [campaignSlug]);

	if (campaign == null || sessionDays == null || members == null) {
		return null;
	}

	const targetMember = targetUserId
		? members.find((member) => member.userId === targetUserId)
		: undefined;
	const filteredSessionDays = targetMember
		? sessionDays.filter((sessionDay) =>
				sessionDay.playersPlaytimes.some(
					(playerPlaytime) => playerPlaytime.userId === targetMember.userId,
				),
			)
		: sessionDays;

	const creationDate = new Date(
		targetMember ? targetMember.createdAt : campaign.createdAt,
	);
	const creationYear = creationDate.getFullYear();
	const currentYear = new Date().getFullYear();
	const years = Array.from(
		{ length: currentYear - creationYear + 1 },
		(_, index) => currentYear - index,
	);
	const secondsThisYear = filteredSessionDays.reduce(
		(acc, current) => acc + getSessionDayPlaytime(current, targetUserId),
		0,
	);

	const graphStyle: PlaytimeGraphStyle = {
		"--playtime-color": PLAYTIME_COLORS[headerColor],
	};

	return (
		<CampaignPlaytimeGraphContainer style={graphStyle}>
			<LeftContainer>
				<HeaderContainer>
					<div className={styles.leftHeader}>
						<p className={styles.timeP}>
							{`${formatPlaytime(secondsThisYear)} `}
						</p>
						em
						<p className={styles.sessionsP}>
							{` ${filteredSessionDays.length} Sessões `}
						</p>
						durante
						<p className={styles.yearP}>{` ${year}`}</p>
					</div>

					<div className={styles.rightHeader}>
						<p className={styles.yearP}>
							{`${formatPlaytime(
								targetMember
									? targetMember.totalPlaytimeSeconds
									: campaign.totalPlaytimeSeconds,
							)} `}
						</p>
						Totais
					</div>
				</HeaderContainer>

				<PlaytimeGraph
					campaign={campaign}
					members={members}
					sessionDays={filteredSessionDays}
					targetUserId={targetUserId}
					color={graphColor}
				/>
			</LeftContainer>

			<YearSelectorContainer>
				{years.map((availableYear) => (
					<YearSelector
						key={availableYear}
						disabled={availableYear === year}
						onClick={() => setYear(availableYear)}>
						{availableYear}
					</YearSelector>
				))}
			</YearSelectorContainer>
		</CampaignPlaytimeGraphContainer>
	);
}

function getSessionDayPlaytime(
	sessionDay: CampaignSessionDay,
	targetUserId?: Guid,
) {
	if (targetUserId == null) return sessionDay.playtime.totalPlaytimeSeconds;
	return (
		sessionDay.playersPlaytimes.find(
			(playerPlaytime) => playerPlaytime.userId === targetUserId,
		)?.totalPlaytimeSeconds ?? 0
	);
}

export function formatPlaytime(seconds: number) {
	if (seconds < 60) return `${Math.floor(seconds)} Segundos`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} Minutos`;
	const hours = Math.floor(minutes / 60);
	return `${hours} Horas`;
}

export function formatPlaytimeClock(seconds: number) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return [hours, minutes, remainingSeconds]
		.map((value) => String(value).padStart(2, "0"))
		.join(":");
}
