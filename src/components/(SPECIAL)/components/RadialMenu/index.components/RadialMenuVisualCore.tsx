"use client";

import { ReactNode } from "react";
import styles from "./RadialMenuVisualCore.module.css";
import {
	ACTIVE_EXPANSION,
	RADIAL_START_ANGLE,
	RadialMenuOption,
	RadialMenuRingGeometry,
} from "../types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { newStyledElement } from "@setsu-tp/styled-components";
import { createSectorPath } from "../utils";

const RadialMenuContainer = newStyledElement.div(styles.radialMenuContainer);

interface RadialMenuVisualCoreProps {
	maxRadius: number;
	ringGeometry: RadialMenuRingGeometry[];
	activeDepth: number;
	activeOption: RadialMenuOption | undefined;
	core: ReactNode;
	id: string;
	screenPosition: CoordinatePair;
	coreDiameter: number;
	mode: "fast" | "switch";
	nameColor?: string;
	showNames?: boolean;
}

export function RadialMenuVisualCore({
	id,
	screenPosition,
	coreDiameter,
	mode,
	maxRadius,
	ringGeometry,
	activeDepth,
	activeOption,
	core,
	nameColor,
	showNames = true,
}: RadialMenuVisualCoreProps) {
	return (
		<RadialMenuContainer
			id={id}
			style={{
				left: screenPosition.x,
				top: screenPosition.y,
				width: coreDiameter,
				height: coreDiameter,
			}}
			data-radial-menu-mode={mode}>
			<svg
				className={styles.radialMenuSvg}
				width={maxRadius * 2}
				height={maxRadius * 2}
				viewBox={`${-maxRadius} ${-maxRadius} ${
					maxRadius * 2
				} ${maxRadius * 2}`}>
				{" "}
				<defs>
					{ringGeometry.map((ring) =>
						ring.options.map((option, index) => {
							const gradientId = `${id}-gradient-${ring.depth}-${index}`;
							const waveGradientId = `${id}-wave-gradient-${ring.depth}-${index}`;
							const color = option.backgroundColor ?? "var(--cl-gray-800)";

							return (
								<g key={`${gradientId}-defs`}>
									<radialGradient
										id={gradientId}
										gradientUnits="userSpaceOnUse"
										cx={0}
										cy={0}
										r={ring.outerRadius}>
										<stop
											offset="0%"
											stopColor={color}
											stopOpacity={0.75}
										/>
										<stop
											offset="100%"
											stopColor={color}
											stopOpacity={1}
										/>
									</radialGradient>

									<radialGradient
										id={waveGradientId}
										gradientUnits="userSpaceOnUse"
										cx={0}
										cy={0}
										r={ring.outerRadius}>
										<stop
											offset="0%"
											stopColor={color}
											stopOpacity={0}
										/>
										<stop
											offset="12%"
											stopColor={color}
											stopOpacity={0}
										/>
										<stop
											offset="18%"
											stopColor={color}
											stopOpacity={0.7}>
											<animate
												attributeName="offset"
												values="18%;45%;18%"
												dur="2.2s"
												begin={`${index * 0.12}s`}
												repeatCount="indefinite"
											/>
										</stop>
										<stop
											offset="25%"
											stopColor={color}
											stopOpacity={0}>
											<animate
												attributeName="offset"
												values="25%;52%;25%"
												dur="2.2s"
												begin={`${index * 0.12}s`}
												repeatCount="indefinite"
											/>
										</stop>
										<stop
											offset="100%"
											stopColor={color}
											stopOpacity={0}
										/>
									</radialGradient>
								</g>
							);
						}),
					)}
				</defs>
				{ringGeometry.map((ring, ringIndex) => {
					const sectorSize = (Math.PI * 2) / ring.options.length;

					const childRing =
						ringIndex < ringGeometry.length - 1
							? ringGeometry[ringIndex + 1]
							: undefined;

					const orderedOptions = [
						...ring.options
							.map((option, index) => ({
								option,
								index,
								isSelected:
									childRing?.parentOptionId === option.id ||
									(activeDepth === ring.depth &&
										activeOption?.id === option.id),
							}))
							.filter(({ isSelected }) => !isSelected),
						...ring.options
							.map((option, index) => ({
								option,
								index,
								isSelected:
									childRing?.parentOptionId === option.id ||
									(activeDepth === ring.depth &&
										activeOption?.id === option.id),
							}))
							.filter(({ isSelected }) => isSelected),
					];

					return (
						<g
							key={ring.depth}
							data-radial-depth={ring.depth}
							data-ring-width={ring.width}
							className={styles.radialMenuRing}>
							{orderedOptions.map(({ option, index }) => {
								const startAngle = RADIAL_START_ANGLE + index * sectorSize;

								const endAngle = RADIAL_START_ANGLE + (index + 1) * sectorSize;

								const centerAngle = startAngle + sectorSize / 2;

								const isPathSelected = childRing?.parentOptionId === option.id;

								const isActive =
									activeDepth === ring.depth && activeOption?.id === option.id;

								const isSelected = isPathSelected || isActive;

								const outerRadius =
									ring.outerRadius + (isSelected ? ACTIVE_EXPANSION : 0);

								const gradientId = `${id}-gradient-${ring.depth}-${index}`;
								const waveGradientId = `${id}-wave-gradient-${ring.depth}-${index}`;

								const path = createSectorPath(
									ring.innerRadius,
									outerRadius,
									startAngle,
									endAngle,
								);

								const outerStartX = Math.cos(startAngle) * outerRadius;

								const outerStartY = Math.sin(startAngle) * outerRadius;

								const outerEndX = Math.cos(endAngle) * outerRadius;

								const outerEndY = Math.sin(endAngle) * outerRadius;

								const innerStartX = Math.cos(startAngle) * ring.innerRadius;

								const innerStartY = Math.sin(startAngle) * ring.innerRadius;

								const innerEndX = Math.cos(endAngle) * ring.innerRadius;

								const innerEndY = Math.sin(endAngle) * ring.innerRadius;

								const innerArcPath = [
									`M ${innerStartX} ${innerStartY}`,
									`A ${ring.innerRadius} ${ring.innerRadius} 0 0 1 ${innerEndX} ${innerEndY}`,
								].join(" ");

								const startBorderPath = [
									`M ${innerStartX} ${innerStartY}`,
									`L ${outerStartX} ${outerStartY}`,
								].join(" ");

								const endBorderPath = [
									`M ${innerEndX} ${innerEndY}`,
									`L ${outerEndX} ${outerEndY}`,
								].join(" ");

								const outerIndicatorPadding = 5;
								const indicatorRadius = outerRadius - outerIndicatorPadding;

								const indicatorStartAngle = startAngle + sectorSize * 0.2;

								const indicatorEndAngle = endAngle - sectorSize * 0.2;

								const indicatorStartX =
									Math.cos(indicatorStartAngle) * indicatorRadius;

								const indicatorStartY =
									Math.sin(indicatorStartAngle) * indicatorRadius;

								const indicatorEndX =
									Math.cos(indicatorEndAngle) * indicatorRadius;

								const indicatorEndY =
									Math.sin(indicatorEndAngle) * indicatorRadius;

								const outerIndicatorPath = [
									`M ${indicatorStartX} ${indicatorStartY}`,
									`A ${indicatorRadius} ${indicatorRadius} 0 0 1 ${indicatorEndX} ${indicatorEndY}`,
								].join(" ");

								const contentRadius = (ring.innerRadius + ring.outerRadius) / 2;

								const contentX = Math.cos(centerAngle) * contentRadius;

								const contentY = Math.sin(centerAngle) * contentRadius;

								const shouldShowName =
									option.name !== undefined && (option.showName ?? showNames);

								const resolvedNameColor =
									option.nameColor ?? nameColor ?? "currentColor";

								return (
									<g
										key={option.id}
										data-option-index={index}
										data-option-id={option.id}
										data-active={isActive}
										data-path-selected={isPathSelected}
										data-has-children={Boolean(option.options?.length)}>
										<path
											d={path}
											fill={`url(#${gradientId})`}
											className={`${styles.radialMenuSector} ${
												isSelected ? styles.radialMenuSectorSelected : ""
											}`}
										/>

										<path
											d={path}
											fill={`url(#${waveGradientId})`}
											className={styles.radialMenuSectorWave}
										/>

										<path
											d={innerArcPath}
											className={`${styles.radialMenuSectorBorder} ${
												isSelected ? styles.radialMenuSectorBorderSelected : ""
											}`}
										/>

										<path
											d={startBorderPath}
											className={`${styles.radialMenuSectorBorder} ${
												isSelected ? styles.radialMenuSectorBorderSelected : ""
											}`}
										/>

										<path
											d={endBorderPath}
											className={`${styles.radialMenuSectorBorder} ${
												isSelected ? styles.radialMenuSectorBorderSelected : ""
											}`}
										/>

										{option.options?.length ? (
											<path
												d={outerIndicatorPath}
												className={`${styles.radialMenuBranchIndicator} ${
													isSelected
														? styles.radialMenuBranchIndicatorSelected
														: ""
												}`}
											/>
										) : null}

										<foreignObject
											x={contentX - 60}
											y={contentY - 40}
											width={120}
											height={80}
											pointerEvents="none">
											<div className={styles.radialMenuOptionContent}>
												{option.icon}

												{shouldShowName && (
													<span
														style={{
															color: resolvedNameColor,
														}}>
														{option.name}
													</span>
												)}

												{option.fastKey && (
													<small>{option.fastKey.toUpperCase()}</small>
												)}
											</div>
										</foreignObject>
									</g>
								);
							})}
						</g>
					);
				})}
			</svg>

			<div className={styles.radialMenuCore}>{core}</div>
		</RadialMenuContainer>
	);
}
