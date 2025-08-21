"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { isEmail } from "@/utils/StringUtils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HookedForm } from "@/libs/stp@forms";

const schema = z.object({
	usernameOrEmail: z.string().min(1, "Insira o usuário."),
	password: z.string().min(8, "A senha deve ter mais de 8 caracteres."),
});

type FormData = z.infer<typeof schema>;

export type LoginProps =
	| { password: string; username: string; email?: string }
	| { password: string; username?: string; email: string };
export async function FetchLogin(
	props: LoginProps
): Promise<{ status: number }> {
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
			credentials: "include",
		});
		if (response.status != 200) return { status: response.status };
		return { status: response.status };
	} catch {
		return { status: 500 };
	}
}

async function PerformLogin(props: LoginProps): Promise<boolean> {
	const response = await FetchLogin(props);
	if (response.status != 200) return false;
	return true;
}

interface LoginFormProps {
	redirectTo?: string;
}
export function LoginForm({ redirectTo }: LoginFormProps) {
	const [loginCurrentMessage, setLoginCurrentMessage] = useState<string>(" ");
	const router = useRouter();

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(data: FormData) {
		const status = isEmail(data.usernameOrEmail)
			? await PerformLogin({
					password: data.password,
					email: data.usernameOrEmail,
			  })
			: await PerformLogin({
					password: data.password,
					username: data.usernameOrEmail,
			  });
		if (status == false) setLoginCurrentMessage("Login Falhou.");
		else {
			setLoginCurrentMessage("Login Bem Sucedido!");
			router.push(redirectTo ? redirectTo : "/home");
		}
	}

	return (
		<HookedForm.Form
			form={form}
			onSubmit={onSubmit}
			autoComplete="on">
			<HookedForm.TextInput
				autoComplete="username"
				label="Usuário ou Email *"
				fieldName="usernameOrEmail"
				placeholder="Usuário ou Email"
			/>
			<HookedForm.PasswordInput
				autoComplete="current-password"
				label="Senha *"
				fieldName="password"
				placeholder="Senha"
			/>
			<HookedForm.Space />
			<HookedForm.SubmitButton label="Log In" />
			<HookedForm.SimpleMessage
				message={loginCurrentMessage}
				color={loginCurrentMessage == "Login Bem Sucedido!" ? "green" : "red"}
			/>
		</HookedForm.Form>
	);
}
