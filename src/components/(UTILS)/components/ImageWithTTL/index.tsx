"use client";

import { imageSrcTTL } from "@/utils/Cache";
import Image, { ImageProps } from "next/image";

interface ImageWithTTLProps extends ImageProps {
	ttlMs?: number;
}
export function ImageWithTTL({
	ttlMs = 5 * 60 * 1000,
	src,
	key,
	...rest
}: ImageWithTTLProps) {
	if (typeof src == "string") {
		const finalSrc = imageSrcTTL(src, ttlMs);
		return (
			<Image
				key={`${key}-${finalSrc}`}
				src={finalSrc}
				{...rest}
			/>
		);
	}
	return (
		<Image
			src={src}
			key={key}
			{...rest}
		/>
	);
}
