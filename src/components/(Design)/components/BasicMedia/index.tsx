"use client";

import Image, { ImageProps } from "next/image";
import { VideoHTMLAttributes, useEffect, useState } from "react";

const mediaTypeCache = new Map<string, "image" | "video">();

type BasicMediaProps = {
	src: string;
	onLoad?: (
		event: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>,
	) => void;
	onLoadedMetadata?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
} & (
	| Omit<ImageProps, "src" | "onLoad" | "onLoadedMetadata">
	| Omit<
			VideoHTMLAttributes<HTMLVideoElement>,
			"src" | "onLoad" | "onLoadedMetadata"
	  >
);
export function BasicMedia({
	src,
	onLoad,
	onLoadedMetadata,
	...props
}: BasicMediaProps) {
	const [mediaType, setMediaType] = useState<"image" | "video" | null>(
		mediaTypeCache.get(src) ?? null,
	);

	useEffect(() => {
		let cancelled = false;
		const cached = mediaTypeCache.get(src);
		if (cached) {
			setMediaType(cached);
			return;
		}
		(async () => {
			try {
				const response = await fetch(src, {
					method: "HEAD",
				});
				if (!response.ok)
					throw new Error(`Unable to determine media type: ${response.status}`);
				const contentType = response.headers.get("content-type")?.toLowerCase();
				const type = contentType?.startsWith("video/")
					? "video"
					: contentType?.startsWith("image/")
						? "image"
						: null;
				if (!type) throw new Error("Unsupported media type");
				mediaTypeCache.set(src, type);
				if (!cancelled) setMediaType(type);
			} catch {
				if (!cancelled) setMediaType(null);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [src]);
	if (mediaType === null) return null;

	if (mediaType === "video") {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const {
			fill,
			loader,
			quality,
			priority,
			placeholder,
			blurDataURL,
			unoptimized,
			overrideSrc,
			sizes,
			...videoProps
		} = props as ImageProps & VideoHTMLAttributes<HTMLVideoElement>;
		/* eslint-enable @typescript-eslint/no-unused-vars */

		return (
			<video
				src={src}
				autoPlay
				muted
				loop
				playsInline
				{...(videoProps as VideoHTMLAttributes<HTMLVideoElement>)}
				style={{
					...(videoProps as VideoHTMLAttributes<HTMLVideoElement>).style,
					...(fill
						? {
								position: "absolute",
								width: "100%",
								height: "100%",
								inset: 0,
							}
						: {}),
				}}
				onLoad={onLoad}
				onLoadedMetadata={onLoadedMetadata}
			/>
		);
	}

	return (
		<Image
			{...(props as ImageProps)}
			src={src}
			onLoad={onLoad}
		/>
	);
}
