import Link, { LinkProps } from "next/link";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { LinkPreview } from "@/components/(SPECIAL)";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";
import { AnchorHTMLAttributes, CSSProperties } from "react";
import clsx from "clsx";
import { EditMiniLink } from "@/components/(UTILS)/components/EditMiniLink";

export const StyledLinkContainer = newStyledElement.div(
	styles.styledLinkContainer,
);

export interface StyledLinkProps
	extends LinkProps, AnchorHTMLAttributes<HTMLAnchorElement> {
	title: string;
	href: string;
	icon?: string;
	textMode?: boolean;
	tryAutomaticIcon?: boolean;
	usePreview?: boolean;
	hoverTitle?: string;
	style?: CSSProperties;
	titleStyle?: CSSProperties;
	target?: "_blank" | "_parent" | "_self" | "_top";
	id?: string;
	containerClassName?: string;
	withEditLink?: boolean;
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
	target,
	containerClassName,
	children,
	withEditLink = false,
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
			className={clsx(
				textMode ? styles.styledLinkInTextMode : undefined,
				containerClassName,
			)}>
			{usePreview && (
				<LinkPreview
					href={href}
					title={title}
				/>
			)}
			<Link
				href={href}
				target={target}
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
				{children}
			</Link>
			{withEditLink && <EditMiniLink baseHref={href} />}
		</StyledLinkContainer>
	);
}
