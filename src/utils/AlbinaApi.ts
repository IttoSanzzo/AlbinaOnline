const AlbinaApiAddress = process.env.NEXT_PUBLIC_ALBINA_API_ADDRESS;
const AlbinaApiPort = process.env.NEXT_PUBLIC_ALBINA_API_PORT;
const AlbinaApiSecure = process.env.NEXT_PUBLIC_ALBINA_API_SECURE === "true";
const AlbinaApiProtocol = AlbinaApiSecure ? "https://" : "http://";
const AlbinaApiFullAddress = `${AlbinaApiProtocol}${AlbinaApiAddress}`;

export function getAlbinaApiFullAddress(route?: string): string {
	if (route) return AlbinaApiFullAddress + route;
	return AlbinaApiFullAddress;
}
