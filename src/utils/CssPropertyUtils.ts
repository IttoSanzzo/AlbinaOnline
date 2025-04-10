export function setCssProperty(name: string, value: string) {
	const root = document.documentElement;
	root.style.setProperty(name, value);
}
export function setCssAttribute(name: string, value: string) {
	document.documentElement.setAttribute(name, value);
}
