import styles from "./styles.module.css";
import Image from "next/image";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import { newStyledElement } from "@setsu-tp/styled-components";
import React from "react";

const StyledLinklikeButtonContainer = newStyledElement.div(
	styles.styledLinklikeButtonContainer
);

export interface StyledLinklikeButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	icon?: string;
	textMode?: boolean;
}

export function StyledLinklikeButton({
	title,
	icon,
	textMode = false,
	...rest
}: StyledLinklikeButtonProps) {
	const finalIcon = icon ? (icon[0] === "@" ? icon : `${icon}`) : AlbinaLogo;

	return (
		<StyledLinklikeButtonContainer
			className={textMode ? styles.styledLinklikeButtonInTextMode : undefined}>
			<button {...rest}>
				<Image
					src={finalIcon}
					width={21}
					height={21}
					alt=""
				/>
				<span>{title}</span>
			</button>
		</StyledLinklikeButtonContainer>
	);
}
