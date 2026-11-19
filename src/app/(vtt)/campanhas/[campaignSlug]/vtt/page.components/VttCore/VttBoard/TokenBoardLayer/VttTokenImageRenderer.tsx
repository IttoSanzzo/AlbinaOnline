import { BasicMedia } from "@/components/(Design)/components/BasicMedia";
import styles from "./VttTokenImageRenderer.module.css";
import { Guid } from "@/libs/stp@types";
import { CSSProperties, useEffect, useState } from "react";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import {
	VttTokenAppearanceImageFit,
	VttTokenType,
} from "../../../Types/Classes/VttToken";

const timestamps = new Map<Guid, number>();

interface VttTokenImageRendererProps {
	vttTokenId: Guid;
	objectFit?: keyof typeof VttTokenAppearanceImageFit;
}
export function VttTokenImageRenderer({
	vttTokenId,
	objectFit,
}: VttTokenImageRendererProps) {
	const subscribe = useVttContext((state) => state.subscribe);
	const [timestamp, setTimestamp] = useState<number>(() => {
		const existingTimestamp = timestamps.get(vttTokenId);
		if (existingTimestamp !== undefined) return existingTimestamp;
		const newTimestamp = Date.now();
		timestamps.set(vttTokenId, newTimestamp);
		return newTimestamp;
	});

	useEffect(() => {
		return subscribe("VttTokenImageUpdated", (event) => {
			const payload = event.data as { vttTokenId: Guid };
			if (payload.vttTokenId !== vttTokenId) return;
			const newTimestamp = event.timestamp ?? Date.now();
			timestamps.set(vttTokenId, newTimestamp);
			setTimestamp(newTimestamp);
		});
	}, [subscribe, vttTokenId]);

	return (
		<BasicMedia
			src={`${getAlbinaApiFullAddress(`/tokens/${vttTokenId}/artwork`)}?tmp=${timestamp}`}
			alt={"?"}
			className={styles.vttTokenImageRenderer}
			fill
			style={{
				objectFit: objectFit?.toLocaleLowerCase() as CSSProperties["objectFit"],
			}}
		/>
	);
}

interface VttTokenTabEntryImageRendererProps {
	vttTokenId: Guid;
}

export function VttTokenTabEntryImageRenderer({
	vttTokenId,
}: VttTokenTabEntryImageRendererProps) {
	const subscribe = useVttContext((state) => state.subscribe);
	const [timestamp, setTimestamp] = useState<number>(() => {
		const existingTimestamp = timestamps.get(vttTokenId);
		if (existingTimestamp !== undefined) return existingTimestamp;
		const newTimestamp = Date.now();
		timestamps.set(vttTokenId, newTimestamp);
		return newTimestamp;
	});

	useEffect(() => {
		return subscribe("VttTokenImageUpdated", (event) => {
			const payload = event.data as { vttTokenId: Guid };
			if (payload.vttTokenId !== vttTokenId) return;
			const newTimestamp = event.timestamp ?? Date.now();
			timestamps.set(vttTokenId, newTimestamp);
			setTimestamp(newTimestamp);
		});
	}, [subscribe, vttTokenId]);

	return (
		<BasicMedia
			src={`${getAlbinaApiFullAddress(`/tokens/${vttTokenId}/artwork`)}?tmp=${timestamp}`}
			alt={"?"}
			className={styles.vttTokenTabImageRenderer}
			width={40}
			height={40}
		/>
	);
}

interface VttTokenCreationTabEntryImageRendererProps {
	targetId?: Guid;
	type: keyof typeof VttTokenType;
}
export function VttTokenCreationTabEntryImageRenderer({
	targetId,
	type,
}: VttTokenCreationTabEntryImageRendererProps) {
	return (
		<BasicMedia
			src={getAlbinaApiFullAddress(
				(() => {
					if (!targetId || type == "None") return `/favicon/default`;
					switch (type) {
						case "Character":
							return `/chars/${targetId}/token/artwork`;
						case "Creature":
							return `/bestiary/by-id/${targetId}/token/artwork`;
						case "Item":
							return `/items/by-id/${targetId}/token/artwork`;
						default:
							return `/favicon/default`;
					}
				})(),
			)}
			alt={"?"}
			className={styles.vttTokenTabImageRenderer}
			width={40}
			height={40}
		/>
	);
}
