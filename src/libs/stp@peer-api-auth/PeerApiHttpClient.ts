import { PeerApiAuth } from "./PeerApiAuth";

export class PeerApiHttpClient {
	public static async send(
		method: string,
		url: string,
		body?: unknown,
		signal?: AbortSignal,
	): Promise<Response> {
		let bodyString = "";
		let requestBody: BodyInit | undefined;

		if (body !== undefined && body !== null) {
			bodyString = typeof body === "string" ? body : JSON.stringify(body);
			requestBody = bodyString;
		}

		const timestamp = PeerApiAuth.generateTimestamp();
		const bodyHash = await PeerApiAuth.computeBodyHash(bodyString);

		const parsedUrl = new URL(url, "http://peer.local");
		const path = parsedUrl.pathname;

		const signature = await PeerApiAuth.generateSignature(
			method,
			path,
			timestamp,
			bodyHash,
		);

		console.log(method);
		console.log(path);
		console.log(timestamp);
		console.log(bodyHash);
		console.log(bodyString);
		console.log(signature);

		return fetch(url, {
			method,
			body: requestBody,
			signal,
			headers: {
				"Content-Type": "application/json",
				"X-Peer-Timestamp": timestamp,
				"X-Peer-Signature": signature,
			},
		});
	}

	public static get(
		url: string,
		body?: unknown,
		signal?: AbortSignal,
	): Promise<Response> {
		return this.send("GET", url, body, signal);
	}

	public static post(
		url: string,
		body?: unknown,
		signal?: AbortSignal,
	): Promise<Response> {
		return this.send("POST", url, body, signal);
	}

	public static put(
		url: string,
		body?: unknown,
		signal?: AbortSignal,
	): Promise<Response> {
		return this.send("PUT", url, body, signal);
	}

	public static delete(
		url: string,
		body?: unknown,
		signal?: AbortSignal,
	): Promise<Response> {
		return this.send("DELETE", url, body, signal);
	}
}
