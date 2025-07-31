import Link, { LinkProps } from "next/link";
import styles from "./styles.module.css";
import Image from "next/image";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StpIcon, StpIconProps } from "@/libs/stp@icons";

export const StyledLinkWithButtonContainer = newStyledElement.div(
	styles.styledLinkContainer
);
export const ActionButton = newStyledElement.button(styles.actionButton);

export interface StyledLinkWithButtonProps extends LinkProps {
	title: string;
	href: string;
	icon?: string;
	textMode?: boolean;
	tryAutomaticIcon?: boolean;
	buttonIcon: StpIconProps;
	onClick: () => void;
}

export function StyledLinkWithButton({
	title,
	href,
	icon,
	textMode = false,
	tryAutomaticIcon = false,
	onClick,
	buttonIcon,
	...rest
}: StyledLinkWithButtonProps) {
	const finalIcon = icon
		? icon[0] === "@"
			? icon
			: `${icon}`
		: tryAutomaticIcon
		? `https://www.google.com/s2/favicons?domain=${href}&sz=${21}`
		: AlbinaLogo;

	return (
		<StyledLinkWithButtonContainer
			className={textMode ? styles.styledLinkInTextMode : undefined}>
			<Link
				href={href}
				{...rest}>
				<Image
					src={finalIcon}
					width={21}
					height={21}
					alt=""
				/>

				<span>{title}</span>
			</Link>
			<ActionButton onClick={onClick}>{StpIcon(buttonIcon)}</ActionButton>
		</StyledLinkWithButtonContainer>
	);
}
