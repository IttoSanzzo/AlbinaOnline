import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import toast from "react-hot-toast";

const CopyEffectIdsButtonContainer = newStyledElement.div(
	styles.copyEffectIdsButtonContainer,
);
const CopyEffectIdButtonElement = newStyledElement.div(
	styles.copyEffectIdButtonElement,
);

interface CopyEffectIdsButtonProps {
	effectId: string;
	effectLinkId: string;
}
export function CopyEffectIdsButton({
	effectId,
	effectLinkId,
}: CopyEffectIdsButtonProps) {
	return (
		<CopyEffectIdsButtonContainer>
			<CopyEffectIdButtonElement
				onClick={(event) => {
					event.preventDefault();
					navigator.clipboard.writeText(effectId);
					toast.success("Copiado para o clipboard");
				}}>
				<StpIcon name="Copy" />
			</CopyEffectIdButtonElement>
			<CopyEffectIdButtonElement
				onClick={(event) => {
					event.preventDefault();
					navigator.clipboard.writeText(effectLinkId);
					toast.success("Copiado para o clipboard");
				}}>
				<StpIcon name="Copy" />
			</CopyEffectIdButtonElement>
		</CopyEffectIdsButtonContainer>
	);
}
