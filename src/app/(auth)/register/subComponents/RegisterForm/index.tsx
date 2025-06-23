"use client";

import { z } from "zod";
import { RegisterFailed, RegisterFormContainer } from "./styledElements";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormInput } from "./subComponents/RegisterFormInput";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterButton } from "./styledElements";

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
		.min(8, { message: "Senha deve conter ao menos 2 caracteres." })
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
	props: RegisterProps
): Promise<{ status: number; message?: string }> {
	try {
		const response = await fetch(`${getAlbinaApiAddress()}/auth/register`, {
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
	} catch (ex) {
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
	props: RegisterProps
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

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
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
		<RegisterFormContainer onSubmit={handleSubmit(onSubmit)}>
			<RegisterFormInput
				title="Usuário *"
				errorMessage={errors.username ? errors.username.message : undefined}
				field={register("username")}
				placeholder="usuario-exemplar"
			/>
			<RegisterFormInput
				title="Nome *"
				errorMessage={errors.nickname ? errors.nickname.message : undefined}
				field={register("nickname")}
				placeholder="Nome Exemplar"
			/>
			<RegisterFormInput
				title="Email *"
				errorMessage={errors.email ? errors.email.message : undefined}
				field={register("email")}
				placeholder="email@exemplo.com"
			/>
			<RegisterFormInput
				title="Senha *"
				errorMessage={errors.password ? errors.password.message : undefined}
				field={register("password")}
				placeholder="Senha1234"
			/>
			<RegisterButton
				type="submit"
				children="Sign Up"
				disabled={isSubmitting}
			/>
			<RegisterFailed
				children={registerCurrentMessage}
				style={
					registerCurrentMessage == "Cadastro Bem Sucedido!"
						? { color: "green" }
						: undefined
				}
			/>
		</RegisterFormContainer>
	);
}
