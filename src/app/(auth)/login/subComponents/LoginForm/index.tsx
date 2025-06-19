"use client";

import { z } from "zod";
import { LoginFailed, LoginFormContainer } from "./styledElements";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormInput } from "./subComponents/LoginFormInput";
import { LoginButton } from "./subComponents/LoginFormInput/styledElements";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { isEmail } from "@/utils/StringUtils";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
): Promise<{ status: number; user?: any }> {
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
		const data = await response.json();
		return { ...data, status: response.status };
	} catch (ex) {
		return { status: 500 };
	}
}

async function PerformLogin(props: LoginProps): Promise<boolean> {
	const response = await FetchLogin(props);
	if (response.status != 200) return false;
	if (!!response.user) {
		return true;
	}
	return false;
}

interface LoginFormProps {
	redirectTo?: string;
}
export function LoginForm({ redirectTo }: LoginFormProps) {
	const [loginCurrentMessage, setLoginCurrentMessage] = useState<string>("");
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
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
		<LoginFormContainer onSubmit={handleSubmit(onSubmit)}>
			<LoginFormInput
				title="Usuário ou Email *"
				errorMessage={
					errors.usernameOrEmail ? errors.usernameOrEmail.message : undefined
				}
				field={register("usernameOrEmail")}
				placeholder="Usuário ou Email"
			/>
			<LoginFormInput
				title="Senha *"
				errorMessage={errors.password ? errors.password.message : undefined}
				field={register("password")}
				placeholder="Senha"
			/>
			<LoginButton
				type="submit"
				children="Log In"
				disabled={isSubmitting}
			/>
			<LoginFailed
				children={loginCurrentMessage}
				style={
					loginCurrentMessage == "Login Bem Sucedido!"
						? { color: "green" }
						: undefined
				}
			/>
		</LoginFormContainer>
	);
}
