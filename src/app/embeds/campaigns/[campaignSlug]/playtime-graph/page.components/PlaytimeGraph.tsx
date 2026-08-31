"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./PlaytimeGraph.module.css";
import {
	Campaign,
	CampaignMember,
	CampaignSessionDay,
	Guid,
} from "@/libs/stp@types";
import { formatPlaytimeClock, PlaytimeColor } from "./CampaignPlaytimeGraph";
import { createPortal } from "react-dom";
import { useState } from "react";

const GraphContainer = newStyledElement.div(styles.graphContainer);
const WeekdayContainer = newStyledElement.div(styles.weekdayContainer);
const Weekday = newStyledElement.div(styles.weekday);
const CalendarContainer = newStyledElement.div(styles.calendarContainer);
const MonthContainer = newStyledElement.div(styles.monthContainer);
const Month = newStyledElement.div(styles.month);
const WeeksContainer = newStyledElement.div(styles.weeksContainer);
const Week = newStyledElement.div(styles.week);
const Day = newStyledElement.div(styles.day);
const Tooltip = newStyledElement.div(styles.tooltip);

function getDateKey(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
		2,
		"0",
	)}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDateOnly(date: string) {
	const [year, month, day] = date.split("-").map(Number);
	return new Date(year, month - 1, day);
}

function getPlaytimeLevel(seconds: number) {
	if (seconds < 0) return -1;
	if (seconds == 0) return 0;
	if (seconds < 30 * 60) return 1;
	if (seconds < 60 * 60) return 2;
	if (seconds < 2 * 60 * 60) return 3;
	if (seconds < 3 * 60 * 60) return 4;
	if (seconds < 4 * 60 * 60) return 5;
	if (seconds < 5 * 60 * 60) return 6;
	if (seconds < 6 * 60 * 60) return 7;
	return 8;
}

function getDayPlaytime(sessionDay: CampaignSessionDay, targetUserId?: Guid) {
	if (targetUserId == null) return sessionDay.playtime.totalPlaytimeSeconds;
	return (
		sessionDay.playersPlaytimes.find(
			(playerPlaytime) => playerPlaytime.userId === targetUserId,
		)?.totalPlaytimeSeconds ?? 0
	);
}

function getFirstWeekStart(year: number) {
	const date = new Date(year, 0, 1);
	date.setDate(date.getDate() - date.getDay());
	return date;
}

function getLastWeekStart(year: number) {
	const date = new Date(year, 11, 31);
	date.setDate(date.getDate() - date.getDay());
	return date;
}

interface PlaytimeGraphProps {
	campaign: Campaign;
	sessionDays: CampaignSessionDay[];
	members: CampaignMember[];
	targetUserId?: Guid;
	graphColor: PlaytimeColor;
	tootipColor?: PlaytimeColor;
	year?: number;
}
export function PlaytimeGraph({
	campaign,
	sessionDays,
	members,
	targetUserId,
	graphColor = "teal",
	tootipColor = graphColor,
	year = new Date().getFullYear(),
}: PlaytimeGraphProps) {
	const [tooltip, setTooltip] = useState<{
		content: React.ReactNode;
		x: number;
		y: number;
	} | null>(null);

	const campaignCreationDate = parseDateOnly(campaign.createdAt.split("T")[0]);
	const memberNameMap = new Map<Guid, string>(
		members.map((x) => [x.userId, x.user.nickname]),
	);

	const firstWeekStart = getFirstWeekStart(year);
	const lastWeekStart = getLastWeekStart(year);
	const weeks: Date[][] = [];
	const today = new Date();

	for (
		const weekStart = new Date(firstWeekStart);
		weekStart <= lastWeekStart;
		weekStart.setDate(weekStart.getDate() + 7)
	) {
		const week: Date[] = [];
		for (let dayIndex = 0; dayIndex < 7; ++dayIndex) {
			const date = new Date(weekStart);
			date.setDate(date.getDate() + dayIndex);
			week.push(date);
		}
		weeks.push(week);
	}

	const sessionDaysByDate = new Map(
		sessionDays.map((sessionDay) => [
			getDateKey(parseDateOnly(sessionDay.date)),
			sessionDay,
		]),
	);

	const monthPositions = MONTHS.map((monthName, monthIndex) => {
		const firstDay = new Date(year, monthIndex, 1);
		const weekIndex = Math.floor(
			(firstDay.getTime() - firstWeekStart.getTime()) /
				(7 * 24 * 60 * 60 * 1000),
		);
		return {
			name: monthName,
			weekIndex,
		};
	});

	return (
		<>
			<GraphContainer data-color={graphColor}>
				<CalendarContainer>
					<WeekdayContainer>
						<div />

						{WEEKDAYS.map((weekday) => (
							<Weekday key={weekday}>{weekday}</Weekday>
						))}
					</WeekdayContainer>

					<div className={styles.graph}>
						<MonthContainer>
							{monthPositions.map((month) => (
								<Month
									key={month.name}
									style={{
										gridColumnStart: month.weekIndex + 1,
									}}>
									{month.name}
								</Month>
							))}
						</MonthContainer>

						<WeeksContainer>
							{weeks.map((week, weekIndex) => (
								<Week key={weekIndex}>
									{week.map((date) => {
										const dateKey = getDateKey(date);
										const isCurrentYear = date.getFullYear() === year;
										const isBeforeCampaign = date < campaignCreationDate;
										const isAfterToday = date > today;
										if (!isCurrentYear || isBeforeCampaign || isAfterToday) {
											return (
												<Day
													key={dateKey}
													className={styles.emptyDay}
												/>
											);
										}

										const sessionDay = sessionDaysByDate.get(dateKey);
										const playtime = sessionDay
											? getDayPlaytime(sessionDay, targetUserId)
											: -1;
										const level = getPlaytimeLevel(playtime);

										return (
											<Day
												key={dateKey}
												data-level={level}
												onMouseEnter={(event) => {
													const rect =
														event.currentTarget.getBoundingClientRect();
													setTooltip({
														content: (
															<>
																{playtime >= 0
																	? `${date.toLocaleDateString(
																			"pt-BR",
																		)}: ${formatPlaytimeClock(playtime)}${
																			!targetUserId ? "\n" : ""
																		}${
																			targetUserId
																				? ""
																				: sessionDay?.playersPlaytimes
																						.slice()
																						.sort(
																							(a, b) =>
																								b.totalPlaytimeSeconds -
																								a.totalPlaytimeSeconds,
																						)
																						.map(
																							(memberPlaytime) =>
																								`\n${memberNameMap.get(
																									memberPlaytime.userId,
																								)}: ${formatPlaytimeClock(
																									memberPlaytime.totalPlaytimeSeconds,
																								)}`,
																						)
																						.join("")
																		}`
																	: `${date.toLocaleDateString(
																			"pt-BR",
																		)}: Sem Sessão`}
															</>
														),
														x: rect.left + rect.width / 2,
														y: rect.bottom + 6,
													});
												}}
												onMouseLeave={() => setTooltip(null)}
											/>
										);
									})}
								</Week>
							))}
						</WeeksContainer>
					</div>
				</CalendarContainer>
			</GraphContainer>

			{tooltip &&
				createPortal(
					<Tooltip
						style={{
							left: tooltip.x,
							top: tooltip.y,
							color: tootipColor,
						}}>
						{tooltip.content}
					</Tooltip>,
					document.body,
				)}
		</>
	);
}

const WEEKDAYS = [
	"Domingo",
	"Segunda",
	"Terça",
	"Quarta",
	"Quinta",
	"Sexta",
	"Sábado",
];

const MONTHS = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];
