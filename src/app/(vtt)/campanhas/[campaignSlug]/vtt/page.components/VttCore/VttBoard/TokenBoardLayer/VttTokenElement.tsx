import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttTokenElement.module.css";
import { VttToken } from "../../../Types/Classes/VttToken";
import { useVttContext } from "../../../Contexts/VttContextProvider";

const VttTokenElementContainer = newStyledElement.div(
	styles.vttTokenElementContainer,
);

interface VttTokenElementProps {
	vttToken: VttToken;
}
export function VttTokenElement({ vttToken }: VttTokenElementProps) {
	const activeSceneId = useVttContext((store) => store.activeSceneId!);
	const vttPlacement = vttToken.placements.get(activeSceneId);
	if (!vttPlacement) return null;

	return (
		<VttTokenElementContainer
			style={{
				left: vttPlacement.coordinates.x,
				top: vttPlacement.coordinates.y,
			}}></VttTokenElementContainer>
	);
}
