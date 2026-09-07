"use client";

import styles from "./RadialMenuVisualCore.module.css";
import { ReactNode } from "react";
import {
	ACTIVE_EXPANSION,
	RadialMenuOption,
	RadialMenuRingGeometry,
} from "../types";
import { CoordinatesPair } from "@/libs/stp@types/utils/CoordinatesPair";
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
	screenPosition: CoordinatesPair;
	coreDiameter: number;
	mode: "fast" | "switch";
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
				{ringGeometry.map((ring, ringIndex) => {
					const sectorSize = (Math.PI * 2) / ring.options.length;

					return (
						<g
							key={ring.depth}
							data-radial-depth={ring.depth}
							data-ring-width={ring.width}>
							{ring.options.map((option, index) => {
								const startAngle = index * sectorSize;
								const endAngle = (index + 1) * sectorSize;
								const centerAngle = startAngle + sectorSize / 2;
								const hasChildRing = ringIndex < ringGeometry.length - 1;
								const childRing = hasChildRing
									? ringGeometry[ringIndex + 1]
									: undefined;
								const isPathSelected = childRing?.parentOptionId === option.id;
								const isActive =
									activeDepth === ring.depth && activeOption?.id === option.id;
								const isSelected = isPathSelected || isActive;
								const outerRadius =
									ring.outerRadius + (isSelected ? ACTIVE_EXPANSION : 0);

								const path = createSectorPath(
									ring.innerRadius,
									outerRadius,
									startAngle,
									endAngle,
								);

								const contentRadius = (ring.innerRadius + ring.outerRadius) / 2;
								const contentX = Math.cos(centerAngle) * contentRadius;
								const contentY = Math.sin(centerAngle) * contentRadius;
								return (
									<g
										key={option.id}
										data-option-index={index}
										data-option-id={option.id}
										data-active={isActive}
										data-path-selected={isPathSelected}>
										<path
											d={path}
											fill={option.backgroundColor ?? "var(--cl-gray-800)"}
											stroke="var(--cl-gray-500)"
											strokeWidth={1}
										/>

										<foreignObject
											x={contentX - 60}
											y={contentY - 40}
											width={120}
											height={80}
											pointerEvents="none">
											<div className={styles.radialMenuOptionContent}>
												{option.icon}
												<span>{option.name}</span>
												{option.fastKey && <small>{option.fastKey}</small>}
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
