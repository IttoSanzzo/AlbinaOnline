import { CSSProperties, ReactNode } from "react";
import { KeenSliderOptions, useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { CarouselContainer, SlideContainer } from "./styledElements";

interface CarouselProps extends KeenSliderOptions {
	slideChilds: ReactNode[];
	minWidth?: number;
	maxWidth?: number;
	loop?: boolean;
	mode?: "free" | "free-snap" | "snap";
	slidesPerView?: number | "auto";
	slidesSpacing?: number;
	slidesOrigin?: number | "auto" | "center" | undefined;
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
	...rest
}: CarouselProps) {
	const [sliderRef] = useKeenSlider<HTMLDivElement>({
		loop,
		mode,
		slides: {
			perView: slidesPerView,
			spacing: slidesSpacing,
			origin: slidesOrigin,
			number: slideChilds.length,
		},
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
