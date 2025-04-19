export function getPageFavicon(address: string): string {
	if (address[0] === "/") return `${process.env.ALBINA_API}/favicon${address}`;
	return `https://www.google.com/s2/favicons?domain=${address}`;
}
