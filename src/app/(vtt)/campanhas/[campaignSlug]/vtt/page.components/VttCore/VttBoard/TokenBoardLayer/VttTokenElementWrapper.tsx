import { Guid } from "@/libs/stp@types";
import { VttTokenElement } from "./VttTokenElement";
import { useVttTokenStore } from "../../../Stores/VttTokenStore";
import { memo } from "react";

interface VttTokenElementWrapperProps {
	vttTokenId: Guid;
}
export const VttTokenElementWrapper = memo(function VttTokenElementWrapper({
	vttTokenId,
}: VttTokenElementWrapperProps) {
	const vttToken = useVttTokenStore((store) => store.tokens.get(vttTokenId));
	if (!vttToken) return null;

	return <VttTokenElement vttToken={vttToken} />;
});
