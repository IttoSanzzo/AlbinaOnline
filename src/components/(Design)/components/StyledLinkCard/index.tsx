import { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	StandartBackgroundColor,
	StandartTextColor,
} from "@/components/(UIBasics)";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { LinkPreview } from "@/components/(SPECIAL)";
import { Tilt } from "../Tilt";
import { TiltOptions } from "vanilla-tilt";

const StyledLinkCardContainer = newStyledElement.div(
	styles.styledLinkCardContainer
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
		};
		return (
			<Tilt options={tiltOptions}>
				<StyledLinkCardContainer
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
			</Tilt>
		);
	}
	return (
		<Tilt options={tiltOptions}>
			<StyledLinkCardContainer
				style={containerStyle}
				// data-tilt
				// data-tilt-max="50"
				// data-tilt-speed="400"
				// data-tilt-perspective="500"
			>
				{usePreview && (
					<LinkPreview
						href={href}
						title={title}
						left={(size - 260) / 2}
					/>
				)}
				<Link href={href}>
					<ArtworkContainer style={artworkContainerStyle}>
						<Image
							src={artworkUrl}
							alt=""
							width={size - 1}
							height={size - 1}
						/>
					</ArtworkContainer>
					<TitleContainer
						style={{
							...(titleColor && {
								color: StandartTextColor[titleColor],
							}),
						}}>
						{title}
					</TitleContainer>
				</Link>
			</StyledLinkCardContainer>
		</Tilt>
	);
}
