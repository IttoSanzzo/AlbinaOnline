"use client";

import { CoordinatesPair } from "@/libs/stp@types/utils/CoordinatesPair";
import styles from "./index.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { ReactNode, useEffect, useMemo, useState } from "react";
import React from "react";
import {
	ACTIVE_EXPANSION,
	DEFAULT_CORE_DIAMETER,
	DEFAULT_RING_WIDTH,
	MIN_OPTIONS_PER_RING,
	RadialMenuCoreGeneratorProps,
	RadialMenuOption,
	RadialMenuRing,
	RadialMenuRingGeometry,
	RadialMenuSubmitProps,
	RING_GAP,
} from "./types";
import { RadialMenuVisualCore } from "./index.components/RadialMenuVisualCore";

const RadialMenuOverlay = newStyledElement.div(styles.radialMenuOverlay);

interface RadialMenuProps {
	id: string;
	mode?: "fast" | "switch";
	overlay?: boolean;
	screenPosition: CoordinatesPair;
	actionPosition: CoordinatesPair;
	coreDiameter?: number;
	ringWidths?: number[];
	options: RadialMenuOption[];
	coreGenerator?: (props: RadialMenuCoreGeneratorProps) => ReactNode;
	onSubmit: (props: RadialMenuSubmitProps) => void;
	onClose: () => void;
}
export function RadialMenu({
	id,
	mode = "fast",
	overlay = false,
	actionPosition,
	screenPosition,
	options,
	coreGenerator,
	coreDiameter = DEFAULT_CORE_DIAMETER,
	ringWidths = [],
	onSubmit,
	onClose,
}: RadialMenuProps) {
	const [cursorPosition, setCursorPosition] =
		useState<CoordinatesPair>(screenPosition);
	const [rings, setRings] = useState<RadialMenuRing[]>([
		{
			options,
			depth: 0,
		},
	]);
	const [activeOption, setActiveOption] = useState<RadialMenuOption>();
	const [activeDepth, setActiveDepth] = useState<number>(0);

	const validateRing = (ringOptions: RadialMenuOption[]) => {
		return ringOptions.length >= MIN_OPTIONS_PER_RING;
	};

	const ringGeometry = useMemo<RadialMenuRingGeometry[]>(() => {
		let previousOuterRadius = coreDiameter / 2;

		return rings.map((ring, index) => {
			const width = ringWidths[ring.depth] ?? DEFAULT_RING_WIDTH;
			const innerRadius = previousOuterRadius + RING_GAP;
			const outerRadius = innerRadius + width;
			const hasChildRing = index < rings.length - 1;
			previousOuterRadius = outerRadius + (hasChildRing ? ACTIVE_EXPANSION : 0);
			return {
				...ring,
				width,
				innerRadius,
				outerRadius,
			};
		});
	}, [rings, coreDiameter, ringWidths]);

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			setCursorPosition({
				x: event.clientX,
				y: event.clientY,
			});
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	useEffect(() => {
		if (!ringGeometry.length) {
			setActiveOption(undefined);
			return;
		}
		const deltaX = cursorPosition.x - screenPosition.x;
		const deltaY = cursorPosition.y - screenPosition.y;
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		const coreRadius = coreDiameter / 2;
		if (distance <= coreRadius) {
			setActiveOption(undefined);
			return;
		}
		let targetRingIndex = -1;
		for (let index = 0; index < ringGeometry.length; index++) {
			const ring = ringGeometry[index];
			if (distance >= ring.innerRadius && distance <= ring.outerRadius) {
				targetRingIndex = index;
				break;
			}
		}

		if (targetRingIndex === -1) {
			if (distance > ringGeometry[ringGeometry.length - 1].outerRadius)
				targetRingIndex = ringGeometry.length - 1;
			else {
				setActiveOption(undefined);
				return;
			}
		}

		const ring = ringGeometry[targetRingIndex];
		if (!ring.options.length) {
			setActiveOption(undefined);
			return;
		}

		let angle = Math.atan2(deltaY, deltaX);
		if (angle < 0) angle += Math.PI * 2;

		const sectorSize = (Math.PI * 2) / ring.options.length;
		const index = Math.floor(angle / sectorSize);

		setActiveDepth(targetRingIndex);
		setActiveOption(ring.options[index]);
	}, [cursorPosition, screenPosition, coreDiameter, ringGeometry]);

	useEffect(() => {
		if (!activeOption) return;

		const childOptions = activeOption.options;
		const nextDepth = activeDepth + 1;
		setRings((current) => {
			const baseRings = current.slice(0, nextDepth);

			if (childOptions && validateRing(childOptions)) {
				const existingRing = current[nextDepth];

				if (
					existingRing &&
					existingRing.parentOptionId === activeOption.id &&
					existingRing.options === childOptions
				)
					return [...baseRings, existingRing];

				return [
					...baseRings,
					{
						options: childOptions,
						depth: nextDepth,
						parentOptionId: activeOption.id,
					},
				];
			}
			return baseRings;
		});
	}, [activeOption, activeDepth]);

	const submit = () => {
		if (!activeOption) return;
		onSubmit({
			option: activeOption,
			depth: activeDepth,
			timestamp: Date.now(),
			cursorPosition: actionPosition,
			close: onClose,
		});
	};

	useEffect(() => {
		const consumeNextContextMenu = () => {
			const handleContextMenu = (event: MouseEvent) => {
				event.preventDefault();
			};
			window.addEventListener("contextmenu", handleContextMenu, {
				once: true,
			});
		};

		const handleMouseDown = (event: MouseEvent) => {
			if (event.button === 2) {
				event.preventDefault();
				consumeNextContextMenu();
				onClose();
				return;
			}

			if (event.button === 0) {
				event.preventDefault();
				submit();
			}
		};

		const handleContextMenu = (event: MouseEvent) => {
			event.preventDefault();
		};
		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("contextmenu", handleContextMenu);
		return () => {
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("contextmenu", handleContextMenu);
		};
	}, [activeOption, activeDepth, onClose]);

	const core = useMemo(() => {
		if (coreGenerator) {
			return coreGenerator({
				cursorPosition,
				option: activeOption,
			});
		}

		return (
			<div className={styles.radialMenuCoreContent}>
				{activeOption?.icon}
				<div>{activeOption?.name}</div>
				{activeOption?.description && <div>{activeOption.description}</div>}
				<div>Right click to cancel</div>
			</div>
		);
	}, [coreGenerator, cursorPosition, activeOption]);

	const maxRadius =
		ringGeometry.length > 0
			? ringGeometry[ringGeometry.length - 1].outerRadius + ACTIVE_EXPANSION
			: coreDiameter / 2;

	const Overlay = overlay ? RadialMenuOverlay : React.Fragment;

	return (
		<Overlay>
			<RadialMenuVisualCore
				key={id}
				id={id}
				screenPosition={screenPosition}
				coreDiameter={coreDiameter}
				mode={mode}
				activeDepth={activeDepth}
				activeOption={activeOption}
				core={core}
				maxRadius={maxRadius}
				ringGeometry={ringGeometry}
			/>
		</Overlay>
	);
}
