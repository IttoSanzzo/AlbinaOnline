"use client";

import { imageSrcTTL } from "@/utils/Cache";
import Image, { ImageProps } from "next/image";

interface ImageWithTTLProps extends ImageProps {
	ttlMs?: number;
}
export function ImageWithTTL({
	ttlMs = 5 * 60 * 1000,
	src,
	...rest
}: ImageWithTTLProps) {
	return (
		<Image
			src={typeof src === "string" ? imageSrcTTL(src, ttlMs) : src}
			{...rest}
		/>
	);
}
