"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import Image from "next/image";
import { useCurrentUser } from "@/libs/stp@hooks";
import { ReactNode } from "react";
import { ExternalConnections } from "@/libs/stp@types";

const ConnectedAccountContainer = newStyledElement.div(
	styles.connectedAccountContainer,
);
const ProviderContainer = newStyledElement.div(styles.providerContainer);
const ChildContainer = newStyledElement.div(styles.childContainer);

interface OtherConnectionProps {
	label: string;
	icon: string;
	childrenGenerator: (data: {
		externalLogins: ExternalConnections | null;
	}) => ReactNode;
}
export function OtherConnection({
	label,
	icon,
	childrenGenerator,
}: OtherConnectionProps) {
	const { externalConnections } = useCurrentUser();

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
			<ChildContainer
				children={childrenGenerator({ externalLogins: externalConnections })}
			/>
		</ConnectedAccountContainer>
	);
}
