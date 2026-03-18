"use client";

const albinaBroadcastUri =
	process.env.NEXT_PUBLIC_BROADCAST_URI ??
	(() => {
		throw new Error("NEXT_PUBLIC_BROADCAST_URI not set");
	})();

interface AlbinaBroadcastProps {
	size?: number | string;
}
export function AlbinaBroadcast({ size = "100%" }: AlbinaBroadcastProps) {
	return (
		<div
			style={{
				position: "relative",
				width: size,
				aspectRatio: "16 / 9",
				pointerEvents: "none",
				overflow: "hidden",
				border: "none",
			}}>
			<iframe
				title="Albina Broadcast"
				src={albinaBroadcastUri}
				width={"100%"}
				height={"100%"}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				tabIndex={-1}
				loading="lazy"
				style={{
					border: "none",
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					zoom: 10,
					aspectRatio: "16/9",
				}}
			/>
		</div>
	);
}
