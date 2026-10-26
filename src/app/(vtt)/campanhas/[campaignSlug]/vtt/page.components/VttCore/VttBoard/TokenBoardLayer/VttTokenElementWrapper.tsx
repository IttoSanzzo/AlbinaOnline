import { Guid } from "@/libs/stp@types";
import { VttTokenElement } from "./VttTokenElement";
import { useVttTokenStore } from "../../../Stores/VttTokenStore";
import { memo } from "react";
import { useVttContext } from "../../../Contexts/VttContextProvider";

export const VTTTOKEN_RENDER_THROTTLE = 5;

interface VttTokenElementWrapperProps {
	vttTokenId: Guid;
}
export const VttTokenElementWrapper = memo(function VttTokenElementWrapper({
	vttTokenId,
}: VttTokenElementWrapperProps) {
	const activeSceneId = useVttContext((state) => state.activeSceneId!);
	const vttToken = useVttTokenStore((store) => store.tokens.get(vttTokenId));
	if (!vttToken) return null;
	const placement = vttToken.placements.get(activeSceneId);
	if (!placement) return null;

	return (
		<VttTokenElement
			vttToken={vttToken}
			placement={placement}
		/>
	);
});
