"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import React, { HTMLAttributes, ReactNode, useEffect, useRef } from "react";
import VanillaTilt, { TiltOptions } from "vanilla-tilt";

const TiltContainer = newStyledElement.div("tiltContainer");

type Props = {
	children?: ReactNode;
	options?: TiltOptions;
} & HTMLAttributes<HTMLDivElement>;

export function Tilt({ children, options, ...props }: Props) {
	const tilt = useRef<(HTMLDivElement & { destoy: () => void }) | null>(null);

	useEffect(() => {
		if (tilt.current !== null) {
			VanillaTilt.init(tilt.current, options);
		}

		return () => {
			if (tilt.current) {
				// @ts-expect-error - Expected
				tilt.current.vanillaTilt.destroy();
			}
		};
	}, [options]);

	return (
		<TiltContainer
			ref={tilt}
			{...props}>
			{children}
		</TiltContainer>
	);
}
