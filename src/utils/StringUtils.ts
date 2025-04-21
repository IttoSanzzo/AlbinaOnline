export function capitalize(src: string): string {
	if (!src) return "";
	return src.charAt(0).toUpperCase() + src.slice(1);
}

export function capitalizeAll(src: string): string {
	return src.replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}
export function capitalizeTitle(src: string): string {
	const exceptions = new Set([
		"a",
		"o",
		"os",
		"as",
		"de",
		"da",
		"do",
		"das",
		"dos",
		"com",
		"sem",
		"por",
		"em",
		"e",
		"que",
	]);

	return src
		.toLowerCase()
		.split(" ")
		.map((word, index) => {
			if (index === 0 || !exceptions.has(word)) {
				return word.charAt(0).toUpperCase() + word.slice(1);
			}
			return word;
		})
		.join(" ");
}

export function idfyString(src: string): string {
	return src
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.toLowerCase();
}
