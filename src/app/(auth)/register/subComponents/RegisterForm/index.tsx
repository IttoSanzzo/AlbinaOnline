"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HookedForm } from "@/libs/stp@forms";

const nicknameInvalidRegex = /[\p{C}]/u;
const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const schema = z.object({
	username: z
		.string()
		.min(3, { message: "Usuário deve conter ao menos 3 carateres." })
		.max(20, { message: "Usuário deve conter no máximo 20 carateres." })
		.refine((val) => /^[a-zA-Z]/.test(val), {
			message: "Usuário deve começar com uma letra.",
		})
		.refine((val) => /^[a-zA-Z0-9_]+$/.test(val), {
			message: "Usuário deve conter apenas letras, numeros, e underlines.",
		})
		.refine((val) => /^[a-z0-9_]+$/.test(val), {
			message: "Todas as letras do usuário devem ser minúsculas.",
		}),
	nickname: z
		.string()
		.min(2, { message: "Nome deve conter ao menos 2 carateres." })
		.max(32, { message: "Nome deve ter no maximo 32 caracteres." })
		.refine((val) => !nicknameInvalidRegex.test(val), {
			message: "Nomes não devem conter caracteres estranhos.",
		}),
	email: z.string().regex(emailRegex, {
		message: "Email em formato inválido.",
	}),
	password: z
		.string()
		.min(8, { message: "Senha deve conter ao menos 8 caracteres." })
		.refine((val) => /[a-zA-Z]/.test(val), {
			message: "Senha deve conter ao menos uma letra.",
		})
		.refine((val) => /\d/.test(val), {
			message: "Senha deve conter ao menos 1 número.",
		}),
});

type FormData = z.infer<typeof schema>;

type RegisterProps = {
	username: string;
	nickname: string;
	email: string;
	password: string;
};
async function FetchRegister(
	props: RegisterProps,
): Promise<{ status: number; message?: string }> {
	try {
		const response = await fetch(`${getAlbinaApiFullAddress()}/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(props),
			cache: "no-cache",
			credentials: "include",
		});
		if (response.status != 200) {
			const payload = await response.json();
			return { status: response.status, message: payload.message };
		}
		return { status: response.status };
	} catch {
		return { status: 500 };
	}
}

const messageMap: Record<string, string> = {
	"This username already exists.": "Usuário já em uso.",
	"This email is already in use.": "Email já em uso.",
	"Provided username is invalid": "Usuário inválido.",
	"Provided nickname is invalid": "Nome inválido.",
	"Provided email is invalid": "Email inválido.",
	"Provided password is invalid": "Senha inválida.",
};

async function PerformRegister(
	props: RegisterProps,
): Promise<{ status: boolean; message?: string }> {
	const response = await FetchRegister(props);
	if (response.status != 200) {
		const message = messageMap[response.message ?? ""] ?? "O cadastro falhou.";
		return { status: false, message: message };
	}
	return { status: true };
}

interface RegisterFormProps {
	redirectTo?: string;
}
export function RegisterForm({ redirectTo }: RegisterFormProps) {
	const [registerCurrentMessage, setRegisterCurrentMessage] =
		useState<string>("");
	const router = useRouter();

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
	});

	async function onSubmit(data: FormData) {
		const response = await PerformRegister({
			username: data.username,
			nickname: data.nickname,
			email: data.email,
			password: data.password,
		});
		if (response.status == false) {
			setRegisterCurrentMessage(response.message!);
		} else {
			setRegisterCurrentMessage("Cadastro Bem Sucedido!");
			router.push(redirectTo ? redirectTo : "/home");
		}
	}

	return (
		<HookedForm.Form
			form={form}
			onSubmit={onSubmit}>
			<HookedForm.TextInput
				autoComplete="username"
				label="Usuário *"
				fieldName="username"
				placeholder="usuario-exemplar"
			/>
			<HookedForm.TextInput
				label="Nome *"
				fieldName="nickname"
				placeholder="Nome Exemplar"
			/>
			<HookedForm.TextInput
				label="Email *"
				fieldName="email"
				placeholder="email@exemplo.com"
			/>
			<HookedForm.PasswordInput
				autoComplete="current-password"
				label="Senha *"
				fieldName="password"
				placeholder="Senha1234"
			/>
			<HookedForm.SubmitButton label="Sign Up" />
			<HookedForm.SimpleMessage
				message={registerCurrentMessage}
				color={
					registerCurrentMessage == "Cadastro Bem Sucedido!" ? "green" : "red"
				}
			/>
		</HookedForm.Form>
	);
}
