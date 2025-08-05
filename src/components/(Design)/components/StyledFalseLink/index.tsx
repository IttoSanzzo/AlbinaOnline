import Image from "next/image";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import React from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const StyledFalseLinkContainer = newStyledElement.div(
	styles.styledFalseLinkContainer
);

export interface StyledFalseLinkProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	icon?: string;
	textMode?: boolean;
}

export function StyledFalseLink({
	title,
	icon,
	textMode = false,
	...rest
}: StyledFalseLinkProps) {
	const finalIcon = icon
		? icon[0] === "@"
			? icon
			: `${icon}?size=21`
		: AlbinaLogo;

	return (
		<StyledFalseLinkContainer
			className={textMode ? styles.styledFalseLinkInTextMode : undefined}>
			<button
				onClick={(event) => {
					event.preventDefault();
				}}
				{...rest}>
				<Image
					src={finalIcon}
					width={21}
					height={21}
					alt=""
				/>
				<span>{title}</span>
			</button>
		</StyledFalseLinkContainer>
	);
}
