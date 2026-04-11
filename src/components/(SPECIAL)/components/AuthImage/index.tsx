"use client";

import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface ImageCacheData {
	url: string;
	expiresAt: number;
}
const imageCache: Map<string, ImageCacheData> =
	(globalThis as unknown as { __imageCache: Map<string, ImageCacheData> })
		.__imageCache ??
	((
		globalThis as unknown as { __imageCache: Map<string, ImageCacheData> }
	).__imageCache = new Map<string, ImageCacheData>());

const TTL = 5 * 60 * 1000;

interface AuthImageProps extends Omit<ImageProps, "src"> {
	src: string;
}
export default function AuthImage({ src, ...rest }: AuthImageProps) {
	const [url, setUrl] = useState<string | null>(null);

	useEffect(() => {
		async function load() {
			const now = Date.now();
			const cached = imageCache.get(src);
			if (cached && cached.expiresAt > now) {
				setUrl(cached.url);
				return;
			}
			const response = await authenticatedFetchAsync(src);
			const blob = await response.blob();
			const objectUrl = URL.createObjectURL(blob);

			imageCache.set(src, {
				url: objectUrl,
				expiresAt: now + TTL,
			});
			setUrl(objectUrl);
		}
		load();
	}, [src]);

	if (!url) return null;
	return (
		<Image
			src={url}
			fill
			unoptimized
			{...rest}
		/>
	);
}
