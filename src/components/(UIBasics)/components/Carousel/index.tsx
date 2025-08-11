"use client";

import { CSSProperties, ReactNode, useMemo } from "react";
import {
	KeenSliderHooks,
	KeenSliderInstance,
	KeenSliderOptions,
	useKeenSlider,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { routeStorage } from "@/utils/Storage";
import { usePathname } from "next/navigation";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const CarouselContainer = newStyledElement.div(styles.carouselContainer);
export const SlideContainer = newStyledElement.div(styles.slideContainer);

function getCurrentPositionState(pathname: string, memoryName?: string) {
	if (memoryName) {
		const memoryState: string | null = routeStorage.getItem(
			pathname,
			memoryName
		);
		if (memoryState) return Number(memoryState);
	}
	return 0;
}
function setMemoryPositionState(
	value: number,
	pathname: string,
	name?: string
) {
	if (name) routeStorage.setItem(pathname, name, value);
}

interface CarouselProps extends KeenSliderOptions {
	slideChilds: ReactNode[];
	minWidth?: number;
	maxWidth?: number;
	loop?: boolean;
	mode?: "free" | "free-snap" | "snap";
	slidesPerView?: number | "auto";
	slidesSpacing?: number | (() => number);
	slidesOrigin?: number | "auto" | "center";
	routeSensitiveMemory?: boolean;
	memoryId?: string;
}
export function Carousel({
	slideChilds,
	minWidth,
	maxWidth,
	loop = true,
	mode = "free-snap",
	slidesPerView = "auto",
	slidesSpacing = 0,
	slidesOrigin = "auto",
	routeSensitiveMemory = true,
	memoryId,
	...rest
}: CarouselProps) {
	const pathname = routeSensitiveMemory ? usePathname() : "";
	const memoryName = useMemo(() => {
		return memoryId && memoryId !== "" ? `Caroulsel/${memoryId}` : undefined;
	}, [memoryId]);

	const defaultChangeHandler = memoryId
		? (event: KeenSliderInstance<{}, {}, KeenSliderHooks>) => {
				setMemoryPositionState(event.track.details.rel, pathname, memoryName);
		  }
		: undefined;

	const [sliderRef] = useKeenSlider<HTMLDivElement>({
		loop,
		mode,
		slides: {
			perView: slidesPerView,
			spacing: slidesSpacing,
			origin: slidesOrigin,
			number: slideChilds.length,
		},
		initial: getCurrentPositionState(pathname, memoryName),
		slideChanged: defaultChangeHandler,
		...rest,
	});

	const slideStyle: CSSProperties = {
		...(minWidth && { minWidth: `${minWidth}px` }),
		...(maxWidth && { maxWidth: `${maxWidth}px` }),
	};

	return (
		<CarouselContainer
			ref={sliderRef}
			className="keen-slider">
			{slideChilds.map((slide, index) => (
				<SlideContainer
					key={index}
					className="keen-slider__slide"
					style={slideStyle}
					children={slide}
				/>
			))}
		</CarouselContainer>
	);
}
