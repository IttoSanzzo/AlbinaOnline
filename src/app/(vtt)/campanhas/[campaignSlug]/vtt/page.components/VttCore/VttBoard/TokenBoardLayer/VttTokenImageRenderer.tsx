import { BasicMedia } from "@/components/(Design)/components/BasicMedia";
import styles from "./VttTokenImageRenderer.module.css";
import { Guid } from "@/libs/stp@types";
import { CSSProperties, useEffect, useState } from "react";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { VttTokenAppearanceImageFit } from "../../../Types/Classes/VttToken";

interface VttTokenImageRendererProps {
	vttTokenId: Guid;
	objectFit?: keyof typeof VttTokenAppearanceImageFit;
}
export function VttTokenImageRenderer({
	vttTokenId,
	objectFit,
}: VttTokenImageRendererProps) {
	const subscribe = useVttContext((state) => state.subscribe);
	const [timestamp, setTimestamp] = useState<number>(Date.now());

	useEffect(() => {
		return subscribe("VttTokenImageUpdated", (event) => {
			const payload = event.data as { vttTokenId: Guid };
			if (payload.vttTokenId !== vttTokenId) return;
			setTimestamp(event.timestamp ?? Date.now());
		});
	}, [subscribe, vttTokenId]);

	const src = `${getAlbinaApiFullAddress(`/tokens/${vttTokenId}/artwork`)}?tmp=${timestamp}`;

	return (
		<BasicMedia
			src={src}
			alt={"?"}
			className={styles.vttTokenImageRenderer}
			fill
			style={{
				objectFit: objectFit?.toLocaleLowerCase() as CSSProperties["objectFit"],
			}}
		/>
	);
}
