"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import {
	ACTIVE_EXPANSION,
	DEFAULT_CORE_DIAMETER,
	DEFAULT_RING_WIDTH,
	RADIAL_START_ANGLE,
	RING_GAP,
	RadialMenuOption,
	RadialMenuRing,
	RadialMenuRingGeometry,
} from "./types";
import { RadialMenuVisualCore } from "./index.components/RadialMenuVisualCore";
import { DefaultRadialMenuCore } from "./index.components/DefaultRadialMenuCore";
import { RadialMenuData } from "./Context";
import { validateRing } from "./utils";

const RadialMenuContainer = newStyledElement.div(styles.radialMenuContainer);
const DEFAULT_RING_WIDTHS: number[] = [];

interface RadialMenuProps extends RadialMenuData {
	onClose: () => void;
}
export function RadialMenu({
	id,
	name,
	screenPosition,
	actionPosition,
	options,
	nameColor,
	showNames,
	submitKeys,
	coreDiameter = DEFAULT_CORE_DIAMETER,
	ringWidths = DEFAULT_RING_WIDTHS,
	mode = "fast",
	coreGenerator,
	onSubmit,
	onClose,
}: RadialMenuProps) {
	const [rings, setRings] = useState<RadialMenuRing[]>(() => [
		{
			options,
			depth: 0,
		},
	]);

	const [activeDepth, setActiveDepth] = useState(0);
	const [activeOption, setActiveOption] = useState<
		RadialMenuOption | undefined
	>(undefined);

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

	const maxRadius = useMemo(() => {
		if (ringGeometry.length === 0) return coreDiameter / 2;
		return Math.max(
			coreDiameter / 2,
			...ringGeometry.map((ring) => ring.outerRadius),
		);
	}, [ringGeometry, coreDiameter]);

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (ringGeometry.length === 0) return;
			const dx = event.clientX - screenPosition.x;
			const dy = event.clientY - screenPosition.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const coreRadius = coreDiameter / 2;

			if (distance <= coreRadius) {
				setActiveOption(undefined);
				setActiveDepth(0);
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
				if (distance > ringGeometry[ringGeometry.length - 1].outerRadius) {
					targetRingIndex = ringGeometry.length - 1;
				} else return;
			}
			const ring = ringGeometry[targetRingIndex];
			const angle = Math.atan2(dy, dx) - RADIAL_START_ANGLE;
			const normalizedAngle =
				((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
			const sectorSize = (Math.PI * 2) / ring.options.length;
			const optionIndex = Math.floor(normalizedAngle / sectorSize);
			setActiveDepth(targetRingIndex);
			setActiveOption(ring.options[optionIndex]);
		},
		[ringGeometry, screenPosition, coreDiameter],
	);

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);

	useEffect(() => {
		if (!activeOption) {
			setActiveDepth(0);
			setRings((current) => {
				if (current.length === 1) return current;
				return current.slice(0, 1);
			});
			return;
		}

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

	const submitOption = useCallback(
		(option: RadialMenuOption, depth: number) => {
			if (!onSubmit) return;
			onSubmit({
				option,
				depth,
				timestamp: Date.now(),
				cursorPosition: actionPosition,
				close: onClose,
			});
		},
		[actionPosition, onSubmit, onClose],
	);

	const submit = useCallback(() => {
		if (!activeOption) return;
		submitOption(activeOption, activeDepth);
	}, [activeOption, activeDepth, submitOption]);

	const resolveFastOption = useCallback(
		(
			option: RadialMenuOption | undefined,
			depth: number,
		): { option: RadialMenuOption; depth: number } | undefined => {
			if (!option) return undefined;
			if (option.options && validateRing(option.options))
				return resolveFastOption(option.options[0], depth + 1);
			return {
				option,
				depth,
			};
		},
		[],
	);

	const submitFast = useCallback(() => {
		const startingOption = activeOption ?? rings[0]?.options[0];
		const resolved = resolveFastOption(
			startingOption,
			activeOption ? activeDepth : 0,
		);
		if (!resolved) return;
		setActiveDepth(resolved.depth);
		setActiveOption(resolved.option);
		submitOption(resolved.option, resolved.depth);
	}, [activeOption, activeDepth, rings, resolveFastOption, submitOption]);

	const handleSubmit = useCallback(() => {
		if (mode === "fast") {
			submitFast();
			return;
		}
		if (!activeOption) return;
		if (activeOption.options && validateRing(activeOption.options)) return;
		submit();
	}, [mode, activeOption, submit, submitFast]);

	useEffect(() => {
		const normalizedSubmitKeys = new Set(
			(submitKeys ?? []).map((key) => key.toLowerCase()),
		);

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
				return;
			}
			if (event.repeat) return;

			const key = event.key.toLowerCase();
			let matchedOption: RadialMenuOption | undefined;
			let matchedDepth = -1;

			for (const ring of rings) {
				const option = ring.options.find(
					(currentOption) => currentOption.fastKey?.toLowerCase() === key,
				);
				if (!option) continue;
				matchedOption = option;
				matchedDepth = ring.depth;
				break;
			}
			if (!matchedOption) return;

			event.preventDefault();
			setActiveDepth(matchedDepth);
			setActiveOption(matchedOption);
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			const key = event.key.toLowerCase();
			if (!normalizedSubmitKeys.has(key)) return;
			event.preventDefault();
			handleSubmit();
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [rings, onClose, submitKeys, handleSubmit]);

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
			if (event.button === 0) event.preventDefault();
		};

		const handleMouseUp = (event: MouseEvent) => {
			if (event.button !== 0) return;
			event.preventDefault();
			handleSubmit();
		};

		const handleContextMenu = (event: MouseEvent) => {
			event.preventDefault();
		};
		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mouseup", handleMouseUp);
		window.addEventListener("contextmenu", handleContextMenu);
		return () => {
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("contextmenu", handleContextMenu);
		};
	}, [handleSubmit, onClose]);

	const core = coreGenerator ? (
		coreGenerator({
			cursorPosition: actionPosition,
			option: activeOption,
		})
	) : (
		<DefaultRadialMenuCore
			name={name}
			option={activeOption}
		/>
	);

	return (
		<RadialMenuContainer>
			{" "}
			<RadialMenuVisualCore
				key={id}
				id={id}
				screenPosition={screenPosition}
				coreDiameter={coreDiameter}
				mode={mode}
				maxRadius={maxRadius}
				ringGeometry={ringGeometry}
				activeDepth={activeDepth}
				activeOption={activeOption}
				core={core}
				nameColor={nameColor}
				showNames={showNames}
			/>{" "}
		</RadialMenuContainer>
	);
}
