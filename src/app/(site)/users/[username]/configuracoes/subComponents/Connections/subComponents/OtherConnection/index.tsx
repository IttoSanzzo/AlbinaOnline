"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import Image from "next/image";
import { useCurrentUser } from "@/libs/stp@hooks";
import { ReactNode } from "react";
import { ExternalLogins } from "@/libs/stp@types";

const ConnectedAccountContainer = newStyledElement.div(
	styles.connectedAccountContainer,
);
const ProviderContainer = newStyledElement.div(styles.providerContainer);

interface OtherConnectionProps {
	label: string;
	icon: string;
	childrenGenerator: (data: {
		externalLogins: ExternalLogins | null;
	}) => ReactNode;
}
export function OtherConnection({
	label,
	icon,
	childrenGenerator,
}: OtherConnectionProps) {
	const { externalLogins } = useCurrentUser();

	return (
		<ConnectedAccountContainer>
			<ProviderContainer>
				<Image
					src={icon}
					alt={`${label}'s icon`}
					width={45}
					height={45}
				/>
				<p>{label}</p>
			</ProviderContainer>
			<div children={childrenGenerator({ externalLogins: externalLogins })} />
		</ConnectedAccountContainer>
	);
}
