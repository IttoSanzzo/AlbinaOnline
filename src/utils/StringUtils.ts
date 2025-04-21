export function capitalize(src: string): string {
	if (!src) return "";
	return src.charAt(0).toUpperCase() + src.slice(1);
}

export function capitalizeAll(src: string): string {
	return src.replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

export function idfyString(src: string): string {
	return src
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.toLowerCase();
}
