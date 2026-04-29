import { CSSProperties } from "react";
import Link from "next/link";
import {
	StandartBackgroundColor,
	StandartTextColor,
} from "@/components/(UIBasics)";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { LinkPreview } from "@/components/(SPECIAL)";
import { Tilt } from "../Tilt";
import { TiltOptions } from "vanilla-tilt";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";

const StyledLinkCardContainer = newStyledElement.div(
	styles.styledLinkCardContainer,
);
const ArtworkContainer = newStyledElement.div(styles.artworkContainer);
const TitleContainer = newStyledElement.div(styles.titleContainer);
const HoverTitleContainer = newStyledElement.div(styles.hoverTitleContainer);

export interface StyledLinkCardProps {
	href: string;
	artworkUrl: string;
	titleColor?: keyof typeof StandartTextColor;
	borderColor?: keyof typeof StandartTextColor;
	backgroundColor?: keyof typeof StandartBackgroundColor;
	titleBackgroundColor?: keyof typeof StandartBackgroundColor;
	title: string;
	size?: number;
	layout?: "square" | "rectangle";
	usePreview?: boolean;
}
export function StyledLinkCard({
	href,
	title,
	artworkUrl,
	size = 150,
	layout = "square",
	titleColor,
	borderColor,
	backgroundColor,
	titleBackgroundColor,
	usePreview = true,
}: StyledLinkCardProps) {
	const tiltOptions: TiltOptions = {
		reverse: true,
		max: 15,
	};
	const containerStyle: CSSProperties = {
		width: `${size}px`,
		height: `${size + (layout == "square" ? 0 : 35)}px`,
		...(titleColor && {
			color: StandartTextColor[titleColor],
		}),
		...(borderColor && {
			borderColor: StandartTextColor[borderColor],
		}),
		...(backgroundColor && {
			backgroundColor: StandartBackgroundColor[backgroundColor],
		}),
	};
	const artworkContainerStyle: CSSProperties = {
		width: `${size}px`,
		height: `${size}px`,
		...(layout == "rectangle" &&
			borderColor && {
				borderColor: StandartTextColor[borderColor],
			}),
	};
	if (layout == "square") {
		const hoverTitleStyle: CSSProperties = {
			...(backgroundColor && {
				backgroundColor: StandartBackgroundColor[backgroundColor],
				...(titleColor && {
					color: StandartTextColor[titleColor],
				}),
			}),
			...(titleBackgroundColor && {
				backgroundColor: StandartBackgroundColor[titleBackgroundColor],
			}),
		};
		return (
			<Tilt options={tiltOptions}>
				<StyledLinkCardContainer
					title={title}
					style={containerStyle}
					data-tilt>
					{usePreview && (
						<LinkPreview
							href={href}
							title={title}
							left={(size - 260) / 2}
						/>
					)}
					<Link href={href}>
						<ArtworkContainer style={artworkContainerStyle}>
							<ImageWithTTL
								src={artworkUrl}
								alt="Card Image"
								width={size * 2 - 2}
								height={size * 2 - 2}
							/>
						</ArtworkContainer>
						<HoverTitleContainer style={hoverTitleStyle}>
							{title}
						</HoverTitleContainer>
					</Link>
				</StyledLinkCardContainer>
			</Tilt>
		);
	}
	return (
		<Tilt options={tiltOptions}>
			<StyledLinkCardContainer
				title={title}
				style={containerStyle}>
				{usePreview && (
					<LinkPreview
						href={href}
						title={title}
						left={(size - 260) / 2}
					/>
				)}
				<Link href={href}>
					<ArtworkContainer style={artworkContainerStyle}>
						<ImageWithTTL
							src={artworkUrl}
							alt="Card Image"
							width={size * 2 - 2}
							height={size * 2 - 2}
						/>
					</ArtworkContainer>
					<TitleContainer
						style={{
							...(titleColor && {
								color: StandartTextColor[titleColor],
							}),
							...(titleBackgroundColor && {
								backgroundColor: StandartBackgroundColor[titleBackgroundColor],
							}),
						}}>
						{title}
					</TitleContainer>
				</Link>
			</StyledLinkCardContainer>
		</Tilt>
	);
}
