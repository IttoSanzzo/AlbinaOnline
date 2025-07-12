"use client";

import { GenericPageContainer, StyledLinkCard } from "@/components/(Design)";
import { StyledOwnedLinkCard } from "@/components/(Design)/components/StyledOwnedLinkCard";
import { NotionGridList } from "@/components/(UTILS)";
import { SetNavBarModules } from "@/libs/stp@hooks";
import { CharacterSimpleData } from "@/libs/stp@types";
import { routeInfra } from "./(routeInfra)";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { ReactNode, useEffect, useRef, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { NotionBox } from "@/components/(NotionBased)";

const Carousel = ({ slides }: { slides: ReactNode[] }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
		slideChanged: () => {
			console.log("changed");
		},
		loop: true,
		mode: "free-snap",
		slides: {
			perView: 3,
		},
	});

	const combinedRef = (node: HTMLDivElement | null) => {
		sliderRef(node);
		containerRef.current = node;
	};

	// useEffect(() => {
	// 	if (!containerRef.current) return;
	// 	const resizeObserver = new ResizeObserver(() => {
	// 		slider.current?.update();
	// 	});
	// 	resizeObserver.observe(containerRef.current);
	// 	return () => resizeObserver.disconnect();
	// }, [sliderRef]);

	return (
		<div
			ref={combinedRef}
			className="keen-slider">
			{slides.map((slide, index) => (
				<div
					key={index}
					className="keen-slider__slide">
					{slide}
				</div>
			))}
		</div>
	);
};

export default function Characters() {
	const [rawCharacters, setRawCharacters] = useState<CharacterSimpleData[]>([]);

	useEffect(() => {
		authenticatedFetchAsync(`${getAlbinaApiAddress()}/chars`, {
			cache: "no-cache",
		}).then((response) => {
			response.json().then((data) => setRawCharacters(data.characters));
		});
	}, [setRawCharacters]);
	const allCharacters: CharacterSimpleData[] = [...rawCharacters].sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Todos os Chars"
			icon={`${getAlbinaApiAddress()}/favicon/core-page/characters`}
			banner={`${getAlbinaApiAddress()}/banner/core-page/characters`}>
			<SetNavBarModules contextMenuButton={routeInfra.PageContextMenu} />

			{/* {allCharacters.length !== 0 && (
				<NotionBox>
					<Carousel
						slides={allCharacters.map((character) => (
							<StyledOwnedLinkCard
								key={character.id}
								ownerId={character.ownerId}
								href={`/chars/${character.id}`}
								title={character.name}
								artworkUrl={character.iconUrl}
								layout="rectangle"
							/>
						))}
					/>
				</NotionBox>
			)} */}

			{/* {allCharacters.length !== 0 && (
				<NotionGridList minColumnWidth={150}>
					{allCharacters.map((character) => (
						<StyledOwnedLinkCard
							key={character.id}
							ownerId={character.ownerId}
							href={`/chars/${character.id}`}
							title={character.name}
							artworkUrl={character.iconUrl}
							layout="rectangle"
						/>
					))}
				</NotionGridList>
			)} */}
		</GenericPageContainer>
	);
}
