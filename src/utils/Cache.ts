export function getCacheMode(): "no-cache" | "force-cache" {
	return process.env.NODE_ENV === "development" ? "no-cache" : "force-cache";
}

export function imageSrcTTL(src: string, ttlMs = 5 * 60 * 1000) {
	const now = Date.now();
	const base = Math.ceil(now / ttlMs) * ttlMs;

	let hash = 0;
	for (let i = 0; i < src.length; i++)
		hash = (hash * 31 + src.charCodeAt(i)) >>> 0;

	const offset = hash % ttlMs;
	const finalTTL = base + offset;
	const separator = src.includes("?") ? "&" : "?";

	return `${src}${separator}nextTTL=${finalTTL}`;
}
