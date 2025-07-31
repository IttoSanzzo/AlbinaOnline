const AlbinaApiHost = process.env.NEXT_PUBLIC_ALBINA_API_HOST;
const AlbinaApiPort = process.env.NEXT_PUBLIC_ALBINA_API_PORT;
const AlbinaApiAddress = `http://${AlbinaApiHost}:${AlbinaApiPort}`;

export function getAlbinaApiAddress(route?: string): string {
	if (route) return AlbinaApiAddress + route;
	return AlbinaApiAddress;
}
