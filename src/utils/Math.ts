export function clamp(input: number, min: number, max: number) {
	return Math.min(Math.max(input, min), max);
}

export function wrap(input: number, min: number, max: number) {
	const range = max - min;
	return ((((input - min) % range) + range) % range) + min;
}
