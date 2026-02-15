"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import Image from "next/image";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { redirect } from "next/navigation";

const SocialLoginButtonContainer = newStyledElement.button(
	styles.socialLoginButtonContainer,
);

async function connectUsingSocialLogin(
	provider: string,
	label: string,
	redirectTo?: string,
) {
	const toastId = toast.loading(`Conectando com ${label}`);
	const response = await authenticatedFetchAsync(
		getAlbinaApiFullAddress(`/auth/login/social/discord`),
		{
			method: "POST",
		},
	);
	if (response.ok == false) {
		toast.error(`Falha ao conectar`, { id: toastId });
		return;
	}
	const { redirectionLink } = await response.json();

	const result = await openOAuthPopup(redirectionLink, `${provider}-oauth`);
	if (result == "success") {
		toast.success(`Conectado com sucesso`, { id: toastId });
		if (redirectTo) redirect(redirectTo);
		redirect("/home");
	} else if (result == "not-linked") {
		toast.error(`Não há conta associada a esse login`, { id: toastId });
	} else if (result == "closed") {
		toast.error(`Conexão cancelada`, { id: toastId });
	} else {
		toast.error(`Falha ao conectar`, { id: toastId });
	}
}

interface SocialLoginButtonProps {
	icon: string;
	label: string;
	provider: string;
	redirectTo?: string;
}
export function SocialLoginButton({
	icon,
	label,
	provider,
	redirectTo,
}: SocialLoginButtonProps) {
	return (
		<SocialLoginButtonContainer
			onClick={async () => {
				await connectUsingSocialLogin(provider, label, redirectTo);
			}}>
			<Image
				src={icon}
				alt={`${label}'s icon`}
				width={50}
				height={50}
			/>
		</SocialLoginButtonContainer>
	);
}

function openOAuthPopup(
	url: string,
	windowName: string,
): Promise<"success" | "error" | "not-linked" | "closed"> {
	return new Promise((resolve) => {
		const width = 500;
		const height = 700;

		const left = window.screenX + (window.outerWidth - width) / 2;
		const top = window.screenY + (window.outerHeight - height) / 2;

		const popup = window.open(
			url,
			windowName,
			`
			width=${width},
			height=${height},
			left=${left},
			top=${top},
			resizable=yes,
			scrollbars=yes
			`,
		);

		if (!popup) {
			resolve("error");
			return;
		}

		function handleMessage(event: MessageEvent) {
			if (event.origin !== getAlbinaApiFullAddress()) return;
			switch (event.data) {
				case "oauth-success":
					cleanup();
					resolve("success");
					break;
				case "oauth-error":
					cleanup();
					resolve("error");
					break;
				case "oauth-not-linked":
					cleanup();
					resolve("not-linked");
					break;
				default:
					break;
			}
		}

		window.addEventListener("message", handleMessage);

		const interval = setInterval(() => {
			if (popup.closed) {
				cleanup();
				resolve("closed");
			}
		}, 500);

		function cleanup() {
			clearInterval(interval);
			window.removeEventListener("message", handleMessage);
		}
	});
}
