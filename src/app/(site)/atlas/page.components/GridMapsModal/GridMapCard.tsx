"use client";

import { LocationData } from "@/libs/stp@types";
import styles from "./GridMapCard.module.css";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import { newStyledElement } from "@setsu-tp/styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { StyledLink } from "@/components/(Design)";

const GridMapCardContainer = newStyledElement.div(styles.gridMapCardContainer);
const ImageContainer = newStyledElement.div(styles.imageContainer);
const Footer = newStyledElement.div(styles.footer);
const Name = newStyledElement.div(styles.name);
const FooterFooter = newStyledElement.div(styles.footerFooter);
const Sizes = newStyledElement.p(styles.sizes);
const Location = newStyledElement.div(styles.location);

interface GridMapCardProps {
	gridMap: GridMap;
}
export function GridMapCard({ gridMap }: GridMapCardProps) {
	const [location, setLocation] = useState<LocationData | null>(null);

	useEffect(() => {
		(async () => {
			if (!gridMap.locationId) return;
			const response = await fetch(
				getAlbinaApiFullAddress(`/atlas/id/${gridMap.locationId}`),
			);
			if (!response.ok) return;
			setLocation(await response.json());
		})();
	}, [gridMap.locationId]);

	return (
		<GridMapCardContainer
			title={
				gridMap.tags.length == 0
					? undefined
					: `Tags:\n${gridMap.tags.join(",\n")}`
			}>
			<ImageContainer>
				<Image
					src={gridMap.imageUrl}
					alt={gridMap.name}
					width={240}
					height={135}
				/>
			</ImageContainer>
			<Footer>
				<Name>{gridMap.name}</Name>
				<FooterFooter>
					<Sizes>{`${gridMap.width / 100} * ${gridMap.height / 100}`}</Sizes>
					{location && (
						<Location
							onClick={(event) => {
								event.stopPropagation();
							}}>
							<StyledLink
								style={{ height: "21px" }}
								title={location.name}
								href={`/atlas/${location.slug}`}
								target={"_blank"}
								icon={location.iconUrl}
							/>
						</Location>
					)}
				</FooterFooter>
			</Footer>
		</GridMapCardContainer>
	);
}
