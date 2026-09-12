"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";
import {
	DEFAULT_GRID_CELL_SIZE,
	useVttGridContext,
} from "../../Contexts/VttGridProvider";
import { useId } from "react";

const VttGridContainer = newStyledElement.div(styles.vttGridContainer);

export function VirtualGridView() {
	const { grid } = useVttGridContext();
	const { viewport, camera, pixelsPerCentimeter } = useVttViewportContext();
	const cellSize = DEFAULT_GRID_CELL_SIZE * pixelsPerCentimeter * camera.zoom;
	const originX =
		viewport.width / 2 - camera.x * pixelsPerCentimeter * camera.zoom;
	const originY =
		viewport.height / 2 - camera.y * pixelsPerCentimeter * camera.zoom;

	return (
		<VttGridContainer>
			<Grid
				viewportWidth={viewport.width}
				viewportHeight={viewport.height}
				originX={originX}
				originY={originY}
				cellSize={cellSize}
				primaryWidth={grid.primaryBorderWidth}
				secondaryWidth={grid.secondaryBorderWidth}
				primaryColor={grid.primaryColor}
				secondaryColor={grid.secondaryColor}
				primaryOpacity={grid.primaryOpacity}
				secondaryOpacity={grid.secondaryOpacity}
			/>
		</VttGridContainer>
	);
}

interface GridProps {
	viewportWidth: number;
	viewportHeight: number;
	originX: number;
	originY: number;
	cellSize: number;

	primaryWidth: number;
	secondaryWidth: number;

	primaryColor: string;
	secondaryColor: string;
	primaryOpacity: number;
	secondaryOpacity: number;
}
export function Grid({
	viewportWidth,
	viewportHeight,
	originX,
	originY,
	cellSize,
	primaryWidth,
	secondaryWidth,
	primaryColor,
	secondaryColor,
	primaryOpacity,
	secondaryOpacity,
}: GridProps) {
	const patternId = `vtt-grid-pattern-${useId()}`;
	const secondaryOffset = primaryWidth;
	const innerOffset = primaryWidth + secondaryWidth;

	return (
		<svg
			className={styles.gridSvg}
			width="100%"
			height="100%"
			viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
			xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern
					id={patternId}
					x={originX - cellSize}
					y={originY - cellSize}
					width={cellSize}
					height={cellSize}
					patternUnits="userSpaceOnUse">
					<path
						d={`
                M 0 0
                H ${cellSize}
                V ${cellSize}
                H 0
                Z

                M ${primaryWidth} ${primaryWidth}
                V ${cellSize - primaryWidth}
                H ${cellSize - primaryWidth}
                V ${primaryWidth}
                Z
              `}
						fill={primaryColor}
						fillRule="evenodd"
						opacity={primaryOpacity}
					/>

					<path
						d={`
                M ${secondaryOffset} ${secondaryOffset}
                H ${cellSize - secondaryOffset}
                V ${cellSize - secondaryOffset}
                H ${secondaryOffset}
                Z

                M ${innerOffset} ${innerOffset}
                V ${cellSize - innerOffset}
                H ${cellSize - innerOffset}
                V ${innerOffset}
                Z
              `}
						fill={secondaryColor}
						fillRule="evenodd"
						opacity={secondaryOpacity}
					/>
				</pattern>
			</defs>

			<rect
				width="100%"
				height="100%"
				fill={`url(#${patternId})`}
				// opacity={grid.opacity}
			/>
		</svg>
	);
}
