import Link, { LinkProps } from "next/link";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { LinkPreview } from "@/components/(SPECIAL)";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";
import { CSSProperties } from "react";

export const StyledLinkContainer = newStyledElement.div(
	styles.styledLinkContainer,
);

export interface StyledLinkProps extends LinkProps {
	title: string;
	href: string;
	icon?: string;
	textMode?: boolean;
	tryAutomaticIcon?: boolean;
	usePreview?: boolean;
	hoverTitle?: string;
	style?: CSSProperties;
	titleStyle?: CSSProperties;
}

export function StyledLink({
	title,
	href,
	icon,
	textMode = false,
	tryAutomaticIcon = false,
	usePreview = true,
	hoverTitle,
	style,
	titleStyle,
	...rest
}: StyledLinkProps) {
	const finalIcon = icon
		? icon[0] === "@"
			? icon
			: icon
		: tryAutomaticIcon
			? `https://www.google.com/s2/favicons?domain=${href}&sz=${21}`
			: AlbinaLogo;

	return (
		<StyledLinkContainer
			style={style}
			title={hoverTitle}
			className={textMode ? styles.styledLinkInTextMode : undefined}>
			{usePreview && (
				<LinkPreview
					href={href}
					title={title}
				/>
			)}
			<Link
				href={href}
				{...rest}>
				<ImageWithTTL
					src={finalIcon}
					width={21}
					height={21}
					alt=""
				/>
				<span
					style={titleStyle}
					title={title}>
					{title}
				</span>
			</Link>
		</StyledLinkContainer>
	);
}
