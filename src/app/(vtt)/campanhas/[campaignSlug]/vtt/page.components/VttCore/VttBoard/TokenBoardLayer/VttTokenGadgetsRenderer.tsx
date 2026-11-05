import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttTokenGadgetsRenderer.module.css";
import { VttToken } from "../../../Types/Classes/VttToken";
import { UseVttResourceDragResult } from "../../../Hooks/useVttResourceDrag";

const VttTokenGadgetsRendererContainer = newStyledElement.div(
	styles.vttTokenGadgetsRendererContainer,
);
const IsEditableIndicator = newStyledElement.span(styles.isEditableIndicator);

interface VttTokenGadgetsRendererProps {
	vttToken: VttToken;
	isEditable?: boolean;
	pixelScale?: number;
	drag: UseVttResourceDragResult;
}
export function VttTokenGadgetsRenderer({
	vttToken,
	isEditable = false,
	pixelScale = 1,
	drag,
}: VttTokenGadgetsRendererProps) {
	const isEditableSize = 5 * pixelScale;
	return (
		<VttTokenGadgetsRendererContainer
			className={styles[vttToken.appearance.chipType]}>
			{isEditable && (
				<IsEditableIndicator
					style={{
						width: isEditableSize,
						height: isEditableSize,
						outlineWidth: 1 * pixelScale,
					}}
				/>
			)}
			{drag.isLocalDragging && (
				<>
					<DragDistanceDisplay
						distance={drag.dragDisplacement ?? 0}
						type={"displacementType"}
					/>
					<DragDistanceDisplay
						distance={drag.dragDistanceTravelled ?? 0}
						type={"distanceTravelledType"}
					/>
				</>
			)}
		</VttTokenGadgetsRendererContainer>
	);
}

const DragDistanceDisplayText = newStyledElement.p(
	styles.dragDistanceDisplayText,
);

interface DragDistanceDisplayProps {
	distance: number;
	type: "displacementType" | "distanceTravelledType";
}
function DragDistanceDisplay({ distance, type }: DragDistanceDisplayProps) {
	if (!distance) return;
	const meters = (distance / 100).toFixed(2);
	return (
		<DragDistanceDisplayText className={styles[type]}>
			{`${meters}m`}
		</DragDistanceDisplayText>
	);
}
