"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import React, { HTMLAttributes, ReactNode, useEffect, useRef } from "react";
import VanillaTilt, { TiltOptions } from "vanilla-tilt";

interface TiltProps extends TiltOptions {}

const TiltContainer = newStyledElement.div("tiltContainer");

type Props = {
	children?: ReactNode;
	options?: TiltProps;
} & HTMLAttributes<HTMLDivElement>;

export function Tilt({ children, options, ...props }: Props) {
	const tilt = useRef<(HTMLDivElement & { destoy: () => void }) | null>(null);

	useEffect(() => {
		if (tilt.current !== null) {
			VanillaTilt.init(tilt.current, options);
		}

		return () => {
			if (tilt.current) {
				// @ts-ignore
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
