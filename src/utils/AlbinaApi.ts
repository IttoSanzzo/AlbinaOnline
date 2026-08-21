const AlbinaApiAddress = process.env.NEXT_PUBLIC_ALBINA_API_ADDRESS;
const AlbinaApiSecure = process.env.NEXT_PUBLIC_ALBINA_API_SECURE === "true";
const AlbinaApiProtocol = AlbinaApiSecure ? "https://" : "http://";
const AlbinaApiFullAddress = `${AlbinaApiProtocol}${AlbinaApiAddress}`;

const AlbinaOnlineAddress = process.env.NEXT_PUBLIC_ALBINA_SITE_ADDRESS;
const AlbinaOnlineSecure =
	process.env.NEXT_PUBLIC_ALBINA_SITE_SECURE === "true";
const AlbinaOnlineProtocol = AlbinaOnlineSecure ? "https://" : "http://";
const AlbinaOnlineFullAddress = `${AlbinaOnlineProtocol}${AlbinaOnlineAddress}`;

export function getAlbinaApiFullAddress(route?: string): string {
	if (route) return AlbinaApiFullAddress + route;
	return AlbinaApiFullAddress;
}
export function getAlbinaOnlineFullAddress(route?: string): string {
	if (route) return AlbinaOnlineFullAddress + route;
	return AlbinaOnlineFullAddress;
}
