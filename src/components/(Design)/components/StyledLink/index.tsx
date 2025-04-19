import Link from "next/link";
import { StyledLinkContainer } from "./styledElements";
import Image from "next/image";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";

interface StyledLinkProps {
	title: string;
	href: string;
	icon?: string;
	display?: "inline-flex" | "flexbox";
}

export function StyledLink({
	title,
	href,
	icon,
	display = "inline-flex",
}: StyledLinkProps) {
	const finalIcon = icon
		? icon[0] === "@"
			? icon
			: `${icon}?size=21`
		: AlbinaLogo;

	return (
		<StyledLinkContainer style={{ display }}>
			<Link href={href}>
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
