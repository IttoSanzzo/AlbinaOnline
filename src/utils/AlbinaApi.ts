"use server";

const AlbinaApiHost = process.env.NEXT_PUBLIC_ALBINA_API_HOST;
const AlbinaApiPort = process.env.NEXT_PUBLIC_ALBINA_API_PORT;
const AlbinaApiAddress = `http://${AlbinaApiHost}:${AlbinaApiPort}`;

function getAlbinaApiAddress(): string {
	return AlbinaApiAddress;
}

export type LoginProps =
	| { password: string; username: string; email?: string }
	| { password: string; username?: string; email: string };
export async function FetchLogin(
	props: LoginProps
): Promise<{ status: 200; token: string; user: any } | { status: number }> {
	try {
		const postBody =
			"username" in props
				? { password: props.password, username: props.username }
				: { password: props.password, email: props.email };

		const response = await fetch(`${getAlbinaApiAddress()}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postBody),
			cache: "no-cache",
		});
		if (response.status != 200) return { status: response.status };
		const data = await response.json();
		return { ...data, status: response.status };
	} catch (ex) {
		return { status: 500 };
	}
}
