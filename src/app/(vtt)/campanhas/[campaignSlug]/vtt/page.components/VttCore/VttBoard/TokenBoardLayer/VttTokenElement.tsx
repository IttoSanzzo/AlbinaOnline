import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttTokenElement.module.css";
import { VttTokenWithScenePlacement } from "../../../Types/Classes/VttToken";

const VttTokenElementContainer = newStyledElement.div(
	styles.vttTokenElementContainer,
);

interface VttTokenElementProps {
	vttToken: VttTokenWithScenePlacement;
}
export function VttTokenElement({ vttToken }: VttTokenElementProps) {
	return (
		<VttTokenElementContainer
			style={{
				left: vttToken.scenePlacement.coordinates.x,
				top: vttToken.scenePlacement.coordinates.y,
			}}></VttTokenElementContainer>
	);
}
