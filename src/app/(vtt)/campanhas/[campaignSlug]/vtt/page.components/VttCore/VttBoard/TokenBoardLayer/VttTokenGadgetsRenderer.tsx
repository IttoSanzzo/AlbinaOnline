import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttTokenGadgetsRenderer.module.css";
import { VttToken } from "../../../Types/Classes/VttToken";

const VttTokenGadgetsRendererContainer = newStyledElement.div(
	styles.vttTokenGadgetsRendererContainer,
);
const IsEditableIndicator = newStyledElement.span(styles.isEditableIndicator);

interface VttTokenGadgetsRendererProps {
	vttToken: VttToken;
	isEditable?: boolean;
	pixelScale?: number;
}
export function VttTokenGadgetsRenderer({
	vttToken,
	isEditable = false,
	pixelScale = 1,
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
		</VttTokenGadgetsRendererContainer>
	);
}
