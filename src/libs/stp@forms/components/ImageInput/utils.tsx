"use client";
import { LintIgnoredAny } from "@/libs/stp@types";
import * as cheerio from "cheerio";

const PINTEREST_PIN_REGEX =
	/^https?:\/\/(?:[a-z]{2,3}\.)?pinterest\.[a-z.]+\/pin\/\d+\/?$/i;

export async function getPinterestImageUrl(
	pinUrl: string,
): Promise<string | null> {
	const response = await fetch(
		`/api/proxy/pinterest?url=${encodeURIComponent(pinUrl)}`,
	);

	if (!response.ok) return null;

	const html = await response.text();
	const $ = cheerio.load(html);

	const ogImage = $('meta[property="og:image"]').attr("content");
	if (ogImage) return ogImage;

	const script = $("#__PWS_DATA__").html();
	if (!script) return null;

	let json: LintIgnoredAny;
	try {
		json = JSON.parse(script);
	} catch {
		return null;
	}

	const pins = json?.props?.initialReduxState?.pins;
	if (!pins) return null;

	const firstPin = Object.values(pins)[0] as LintIgnoredAny;

	const imageUrl =
		firstPin?.images?.orig?.url ||
		firstPin?.images?.originals?.url ||
		firstPin?.images?.large?.url;

	return imageUrl ?? null;
}

async function dataTransferItemToImageFile(
	item: DataTransferItem,
): Promise<File | null> {
	if (item.kind === "file") return item.getAsFile();
	if (item.kind === "string") {
		const raw = await new Promise<string>((resolve) =>
			item.getAsString(resolve),
		);
		if (item.type === "text/uri-list") return await urlToFile(raw);
		if (item.type === "text/x-moz-url") {
			const url = raw.split("\n")[0];
			if (PINTEREST_PIN_REGEX.test(url))
				return await urlToFile(await getPinterestImageUrl(url));
			return await urlToFile(url);
		}
	}
	return null;
}

export async function extractImageFromDrop(
	e: React.DragEvent,
): Promise<File | null> {
	const dt = e.dataTransfer;
	if (dt.files && dt.files.length > 0) return dt.files[0];

	if (dt.items && dt.items.length > 0)
		return await dataTransferItemToImageFile(dt.items[0]);
	return null;
}

export async function extractImagesFromDrop(
	e: React.DragEvent,
): Promise<File[]> {
	const dt = e.dataTransfer;
	if (dt.files && dt.files.length > 0) return Array.from(dt.files ?? []);

	if (dt.items) {
		const files: File[] = [];
		for (const item of Array.from(dt.items)) {
			const imageFile = await dataTransferItemToImageFile(item);
			if (imageFile) files.push(imageFile);
		}
		return files;
	}
	return [];
}

async function urlToFile(url: string | null): Promise<File | null> {
	if (!url) return null;
	try {
		const res = await fetch(
			`/api/proxy/images/external?url=${encodeURIComponent(url)}`,
		);
		const blob = await res.blob();
		if (!blob.type.startsWith("image/")) return null;
		return new File([blob], "dropped-image", { type: blob.type });
	} catch {
		return null;
	}
}
