import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import React from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";

const StyledFalseLinkContainer = newStyledElement.div(
	styles.styledFalseLinkContainer,
);

export interface StyledFalseLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
	const finalIcon = icon ? (icon[0] === "@" ? icon : icon) : AlbinaLogo;

	return (
		<StyledFalseLinkContainer
			className={textMode ? styles.styledFalseLinkInTextMode : undefined}>
			<button
				onClick={(event) => {
					event.preventDefault();
				}}
				{...rest}>
				<ImageWithTTL
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
