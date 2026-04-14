import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor } from "@/components/(UIBasics)";

const LoadingCircleContainer = newStyledElement.div(
	styles.loadingCircleContainer,
);
const LoadingCircleSpan = newStyledElement.span(styles.loadingCircleSpan);

interface LoadingCircleProps {
	size?: number;
	perimeterWidth?: number;
	corePerimeterWidth?: number;
	color?: keyof typeof StandartTextColor;
	backColor?: keyof typeof StandartTextColor;
	centralize?: boolean;
}
export function LoadingCircle({
	size = 150,
	perimeterWidth,
	corePerimeterWidth,
	backColor,
	color,
	centralize = true,
}: LoadingCircleProps) {
	return (
		<LoadingCircleContainer
			style={{
				width: `${size}px`,
				...(centralize && { margin: "auto", marginTop: "50%" }),
			}}>
			<LoadingCircleSpan
				style={{
					...(backColor && {
						borderBottomColor: StandartTextColor[backColor],
						borderRightColor: StandartTextColor[backColor],
						borderLeftColor: StandartTextColor[backColor],
					}),
					...(color && { borderTopColor: StandartTextColor[color] }),
					...(perimeterWidth && {
						borderRightWidth: `${perimeterWidth}px`,
						borderBottomWidth: `${perimeterWidth}px`,
						borderLeftWidth: `${perimeterWidth}px`,
					}),
					...(corePerimeterWidth && {
						borderTopWidth: `${corePerimeterWidth}px`,
					}),
				}}
			/>
		</LoadingCircleContainer>
	);
}
