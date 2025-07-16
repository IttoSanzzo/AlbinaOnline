import { StyledFalseLinkContainer } from "./styledElements";
import styles from "./styles.module.css";
import Image from "next/image";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import React from "react";

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
			<button {...rest}>
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
