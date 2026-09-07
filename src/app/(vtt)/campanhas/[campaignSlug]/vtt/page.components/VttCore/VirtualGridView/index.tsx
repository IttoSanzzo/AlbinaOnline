"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";
import {
	DEFAULT_GRID_CELL_SIZE,
	useVttGridContext,
} from "../../Contexts/VttGridProvider";

const VttGridContainer = newStyledElement.div(styles.vttGridContainer);

export function VirtualGridView() {
	const { grid } = useVttGridContext();
	const { viewport, camera, pixelsPerCentimeter } = useVttViewportContext();
	const cellSize = DEFAULT_GRID_CELL_SIZE * pixelsPerCentimeter * camera.zoom;
	const originX =
		viewport.width / 2 - camera.x * pixelsPerCentimeter * camera.zoom;
	const originY =
		viewport.height / 2 - camera.y * pixelsPerCentimeter * camera.zoom;
	const primaryWidth = grid.primaryBorderWidth;
	const secondaryWidth = grid.secondaryBorderWidth;
	const secondaryOffset = primaryWidth;
	const innerOffset = primaryWidth + secondaryWidth;

	return (
		<VttGridContainer>
			<svg
				width="100%"
				height="100%"
				viewBox={`0 0 ${viewport.width} ${viewport.height}`}
				xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern
						id="vtt-grid-pattern"
						x={originX}
						y={originY}
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
							fill={grid.primaryColor}
							fillRule="evenodd"
							opacity={grid.primaryOpacity}
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
							fill={grid.secondaryColor}
							fillRule="evenodd"
							opacity={grid.secondaryOpacity}
						/>
					</pattern>
				</defs>

				<rect
					width="100%"
					height="100%"
					fill="url(#vtt-grid-pattern)"
					// opacity={grid.opacity}
				/>
			</svg>
		</VttGridContainer>
	);
}
