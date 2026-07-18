"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import { HTMLAttributes, ReactNode, useEffect, useRef } from "react";
import VanillaTilt, { TiltOptions } from "vanilla-tilt";

const TiltContainer = newStyledElement.div("tiltContainer");

type Props = {
	children?: ReactNode;
	options?: TiltOptions;
} & HTMLAttributes<HTMLDivElement>;

export function Tilt({ children, options, ...props }: Props) {
	const tilt = useRef<(HTMLDivElement & { destoy: () => void }) | null>(null);

	useEffect(() => {
		const element = tilt.current;
		if (!element) return;

		VanillaTilt.init(element, options);

		// @ts-expect-error - Expected
		const instance = element.vanillaTilt;

		return () => {
			instance?.destroy();
		};
	}, []);

	return (
		<TiltContainer
			ref={tilt}
			{...props}>
			{children}
		</TiltContainer>
	);
}
