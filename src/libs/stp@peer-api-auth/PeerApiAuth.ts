const encoder = new TextEncoder();

export class PeerApiAuth {
	public static readonly DefaultAllowedTimeDrift = 30;

	public static readonly Secret =
		process.env.PEER_API_AUTH_SECRET ??
		(() => {
			throw new Error("PEER_API_AUTH_SECRET not set");
		})();

	public static generateTimestamp(): string {
		return Math.floor(Date.now() / 1000).toString();
	}

	public static async computeBodyHash(body: string): Promise<string> {
		if (!body) return "";

		const data = encoder.encode(body);
		const hash = await crypto.subtle.digest("SHA-256", data);
		return PeerApiAuth.toHex(hash);
	}

	public static async generateSignature(
		method: string,
		path: string,
		timestamp: string,
		bodyHash: string,
	): Promise<string> {
		const payload = PeerApiAuth.buildPayload(method, path, timestamp, bodyHash);
		return PeerApiAuth.computeHmac(payload);
	}

	private static buildPayload(
		method: string,
		path: string,
		timestamp: string,
		bodyHash: string,
	): string {
		return `${method.toUpperCase()}|${path}|${timestamp}|${bodyHash}`;
	}

	private static async computeHmac(payload: string): Promise<string> {
		const key = await crypto.subtle.importKey(
			"raw",
			encoder.encode(PeerApiAuth.Secret),
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["sign"],
		);

		const signature = await crypto.subtle.sign(
			"HMAC",
			key,
			encoder.encode(payload),
		);

		return PeerApiAuth.toHex(signature);
	}

	private static toHex(buffer: ArrayBuffer): string {
		return [...new Uint8Array(buffer)]
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
	}
}
