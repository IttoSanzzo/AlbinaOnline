export function capitalize(src: string): string {
	if (!src) return "";
	return src.charAt(0).toUpperCase() + src.slice(1);
}

export function capitalizeAll(src: string): string {
	return src.replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}
