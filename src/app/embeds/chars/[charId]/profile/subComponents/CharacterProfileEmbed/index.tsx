"use client";

import { CharacterCoreMetrics, Guid } from "@/libs/stp@types";
import styles from "./styles.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import Image from "next/image";
import HeadFrame from "@/../public/general-assets/embeds/chars/HeadFrame.png";
import NameBarClear from "@/../public/general-assets/embeds/chars/NameBarClear.png";
import NameBarBlackFill from "@/../public/general-assets/embeds/chars/NameBarBlackFill.png";
import { useEffect, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import clsx from "clsx";

const ReactiveContainer = newStyledElement.div(styles.reactiveContainer);
const FrameContainer = newStyledElement.div(styles.frameContainer);
const VerticalGaugeBarContainer = newStyledElement.div(
	styles.verticalGaugeBarContainer,
);
const VerticalGaugeBar = newStyledElement.div(styles.verticalGaugeBar);
const TitleBarContainer = newStyledElement.div(styles.titleBarContainer);
const ProfileTitle = newStyledElement.p(styles.profileTitle);
const LifeBarContainer = newStyledElement.div(styles.lifeBarContainer);
const LifeBar = newStyledElement.div(styles.lifeBar);
const Noise = newStyledElement.div(styles.noise);

interface GaugePercentages {
	life: number;
	mana: number;
	stamina: number;
}

interface CharacterProfileEmbedProps {
	charId: Guid;
	size?: number | string;
	title?: string;
	reactiveId?: string;
	withoutFrame?: boolean;
	fontSize?: string;
	invertReactive?: boolean;
	useLargeSideBars?: boolean;
}
export function CharacterProfileEmbed({
	charId,
	size = "100%",
	title = "",
	reactiveId,
	withoutFrame = false,
	fontSize,
	invertReactive = false,
	useLargeSideBars = false,
}: CharacterProfileEmbedProps) {
	const [gaugePercentages, setGaugePercentages] = useState<GaugePercentages>({
		life: 100,
		mana: 100,
		stamina: 100,
	});

	useEffect(() => {
		async function updateGaugePercentages() {
			const response = await authenticatedFetchAsync(
				getAlbinaApiFullAddress(`/chars/${charId}/core-metrics`),
				{
					method: "GET",
				},
			);
			if (response.ok == false) return;
			const data: CharacterCoreMetrics = await response.json();
			const newGaugePercentages = {
				life:
					data.healthPoints.effectiveMax > 0
						? (data.healthPoints.effectiveCurrent /
								data.healthPoints.effectiveMax) *
							100
						: 0,
				mana:
					data.manaPoints.effectiveMax > 0
						? (data.manaPoints.effectiveCurrent /
								data.manaPoints.effectiveMax) *
							100
						: 0,
				stamina:
					data.staminaPoints.effectiveMax > 0
						? (data.staminaPoints.effectiveCurrent /
								data.staminaPoints.effectiveMax) *
							100
						: 0,
			};
			if (newGaugePercentages != gaugePercentages)
				setGaugePercentages(newGaugePercentages);
		}
		const interval = setInterval(updateGaugePercentages, 5000);
		updateGaugePercentages();
		return () => clearInterval(interval);
	}, [charId]);

	return (
		<div
			style={{
				position: "relative",
				width: size,
				aspectRatio: "1/1",
			}}>
			{reactiveId && (
				<ReactiveContainer>
					<iframe
						src={`https://reactive.fugi.tech/individual/${reactiveId}`}
						style={{
							...(invertReactive && {
								transform: "translate(-50%, -50%) scaleX(-1)",
							}),
						}}
					/>
				</ReactiveContainer>
			)}
			{withoutFrame == false && (
				<FrameContainer>
					<Image
						src={HeadFrame}
						alt="Frame"
						fill
					/>
				</FrameContainer>
			)}
			<VerticalGaugeBarContainer
				className={clsx(
					styles.mana,
					useLargeSideBars ? styles.largeSideBar : undefined,
				)}>
				<VerticalGaugeBar
					style={{
						height: `${gaugePercentages.mana}%`,
					}}>
					<Noise
						className={styles.mana}
						style={{
							animationDuration: `${0.13636 * gaugePercentages.mana + 1.3636}s`,
						}}
					/>
				</VerticalGaugeBar>
			</VerticalGaugeBarContainer>
			<VerticalGaugeBarContainer
				className={clsx(
					styles.stamina,
					useLargeSideBars ? styles.largeSideBar : undefined,
				)}>
				<VerticalGaugeBar style={{ height: `${gaugePercentages.stamina}%` }}>
					<Noise
						className={styles.stamina}
						style={{
							animationDuration: `${0.13636 * gaugePercentages.stamina + 1.3636}s`,
						}}
					/>
				</VerticalGaugeBar>
			</VerticalGaugeBarContainer>
			<TitleBarContainer>
				<Image
					src={NameBarBlackFill}
					alt="Frame background"
					fill
				/>
				<LifeBarContainer>
					<LifeBar style={{ width: `${gaugePercentages.life}%` }}>
						<Noise
							className={styles.life}
							style={{
								animationDuration: `${1 + ((gaugePercentages.life - 1) * 20) / 99}s`,
							}}
						/>
					</LifeBar>
				</LifeBarContainer>
				<Image
					src={NameBarClear}
					alt="Frame"
					fill
				/>
				<ProfileTitle style={{ fontSize: fontSize }}>{title}</ProfileTitle>
			</TitleBarContainer>
		</div>
	);
}
