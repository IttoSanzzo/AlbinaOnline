import Link, { LinkProps } from "next/link";
import { StyledLinkContainer } from "./styledElements";
import styles from "./styles.module.css";
import Image from "next/image";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";

export interface StyledLinkProps extends LinkProps {
	title: string;
	href: string;
	icon?: string;
	textMode?: boolean;
	tryAutomaticIcon?: boolean;
}

export function StyledLink({
	title,
	href,
	icon,
	textMode = false,
	tryAutomaticIcon = false,
	...rest
}: StyledLinkProps) {
	const finalIcon = icon
		? icon[0] === "@"
			? icon
			: `${icon}`
		: tryAutomaticIcon
		? `https://www.google.com/s2/favicons?domain=${href}&sz=${21}`
		: AlbinaLogo;

	return (
		<StyledLinkContainer
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
		</StyledLinkContainer>
	);
}
