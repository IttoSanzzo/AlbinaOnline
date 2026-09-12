"use client";

import { Grid } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/VttCore/VirtualGridView";
import styles from "./MockGrid.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import Image from "next/image";

const ImageGridContainer = newStyledElement.div(styles.imageGridContainer);
const MockGridContainer = newStyledElement.div(styles.mockGridContainer);

interface GridColors {
	primary: string;
	secondary: string;
}

export const DEFAULT_MOCK_GRID_COLORS: GridColors = {
	primary: "#FF0000",
	secondary: "#000000",
};

interface SizeDifference {
	x: number;
	y: number;
}

interface GridMapGridViewerProps {
	gridMap: GridMap;
	showGrid: boolean;
	setSizesAreExact?: Dispatch<
		SetStateAction<{
			x: number;
			y: number;
		}>
	>;
	primaryColor?: string;
	secondaryColor?: string;
}
export function GridMapGridViewer({
	gridMap,
	showGrid,
	setSizesAreExact,
	primaryColor,
	secondaryColor,
}: GridMapGridViewerProps) {
	const [imageSize, setImageSize] = useState({
		width: 0,
		height: 0,
	});

	return (
		<ImageGridContainer>
			<Image
				src={gridMap.imageUrl}
				alt={gridMap.name}
				fill
				onLoad={(event) => {
					const image = event.currentTarget;

					setImageSize({
						width: image.naturalWidth,
						height: image.naturalHeight,
					});
				}}
			/>

			{showGrid && (
				<MockGrid
					width={gridMap.width}
					height={gridMap.height}
					offsetX={gridMap.offsetX}
					offsetY={gridMap.offsetY}
					imageWidth={imageSize.width}
					imageHeight={imageSize.height}
					setSizesAreExact={setSizesAreExact}
					primaryColor={primaryColor}
					secondaryColor={secondaryColor}
				/>
			)}
		</ImageGridContainer>
	);
}

function calculateSizeDifference(
	gridWidth: number,
	gridHeight: number,
	imageWidth: number,
	imageHeight: number,
): SizeDifference {
	return {
		x: gridWidth - imageWidth,
		y: gridHeight - imageHeight,
	};
}
interface MockGridProps {
	width: number;
	height: number;
	offsetX: number;
	offsetY: number;
	imageWidth: number;
	imageHeight: number;
	primaryColor?: string;
	secondaryColor?: string;
	setSizesAreExact?: Dispatch<
		SetStateAction<{
			x: number;
			y: number;
		}>
	>;
}
export function MockGrid({
	width,
	height,
	offsetX,
	offsetY,
	imageWidth,
	imageHeight,
	primaryColor = "#FF0000",
	secondaryColor = "#000000",
	setSizesAreExact,
}: MockGridProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerSize, setContainerSize] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		if (!containerRef.current) return;
		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setContainerSize({ width, height });
		});
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);
	useEffect(() => {
		if (
			!setSizesAreExact ||
			!imageWidth ||
			!imageHeight ||
			!containerSize.width ||
			!containerSize.height
		)
			return;

		const imageScale = Math.min(
			containerSize.width / imageWidth,
			containerSize.height / imageHeight,
		);
		const gridScale = Math.min(
			containerSize.width / width,
			containerSize.height / height,
		);

		const renderedGridWidth = width * gridScale;
		const renderedGridHeight = height * gridScale;
		const renderedImageWidth = imageWidth * imageScale;
		const renderedImageHeight = imageHeight * imageScale;

		setSizesAreExact(
			calculateSizeDifference(
				renderedGridWidth,
				renderedGridHeight,
				renderedImageWidth,
				renderedImageHeight,
			),
		);
	}, [
		width,
		height,
		imageWidth,
		imageHeight,
		containerSize.width,
		containerSize.height,
		setSizesAreExact,
	]);

	if (
		!imageWidth ||
		!imageHeight ||
		!containerSize.width ||
		!containerSize.height
	)
		return <MockGridContainer ref={containerRef} />;

	return (
		<MockGridContainer ref={containerRef}>
			<Grid
				viewportWidth={width}
				viewportHeight={height}
				originX={offsetX}
				originY={offsetY}
				cellSize={100}
				primaryWidth={1}
				primaryColor={primaryColor}
				primaryOpacity={1}
				secondaryWidth={1}
				secondaryColor={secondaryColor}
				secondaryOpacity={1}
			/>
		</MockGridContainer>
	);
}
