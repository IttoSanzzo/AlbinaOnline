import {
	NotionTextColor,
	NotionBackgroundColor,
} from "@/components/(NotionBased)";
import {
	ArtworkContainer,
	HoverTitleContainer,
	StyledLinkCardContainer,
	TitleContainer,
} from "./styledElements";
import { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";

export interface StyledLinkCardProps {
	href: string;
	artworkUrl: string;
	titleColor?: keyof typeof NotionTextColor;
	borderColor?: keyof typeof NotionTextColor;
	backgroundColor?: keyof typeof NotionBackgroundColor;
	title: string;
	size?: number;
	layout?: "square" | "rectangle";
}
export async function StyledLinkCard({
	href,
	title,
	artworkUrl,
	size = 150,
	layout = "square",
	titleColor,
	borderColor,
	backgroundColor,
}: StyledLinkCardProps) {
	const containerStyle: CSSProperties = {
		width: `${size}px`,
		height: `${size + (layout == "square" ? 0 : 35)}px`,
		...(titleColor && {
			color: NotionTextColor[titleColor],
		}),
		...(borderColor && {
			borderColor: NotionTextColor[borderColor],
		}),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
	};
	const artworkContainerStyle: CSSProperties = {
		width: `${size}px`,
		height: `${size}px`,
		...(layout == "rectangle" &&
			borderColor && {
				borderColor: NotionTextColor[borderColor],
			}),
	};
	if (layout == "square") {
		const hoverTitleStyle: CSSProperties = {
			...(backgroundColor && {
				backgroundColor: NotionBackgroundColor[backgroundColor],
			}),
		};
		return (
			<StyledLinkCardContainer style={containerStyle}>
				<Link href={href}>
					<ArtworkContainer style={artworkContainerStyle}>
						<Image
							src={artworkUrl}
							alt=""
							width={size - 1}
							height={size - 1}
						/>
					</ArtworkContainer>
					<HoverTitleContainer style={hoverTitleStyle}>
						{title}
					</HoverTitleContainer>
				</Link>
			</StyledLinkCardContainer>
		);
	}
	return (
		<StyledLinkCardContainer style={containerStyle}>
			<Link href={href}>
				<ArtworkContainer style={artworkContainerStyle}>
					<Image
						src={artworkUrl}
						alt=""
						width={size - 1}
						height={size - 1}
					/>
				</ArtworkContainer>
				<TitleContainer>{title}</TitleContainer>
			</Link>
		</StyledLinkCardContainer>
	);
}
