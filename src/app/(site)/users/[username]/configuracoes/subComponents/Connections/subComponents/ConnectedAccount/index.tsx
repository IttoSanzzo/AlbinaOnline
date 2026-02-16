"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import Image from "next/image";
import { useCurrentUser } from "@/libs/stp@hooks";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import toast from "react-hot-toast";

const ConnectedAccountContainer = newStyledElement.div(
	styles.connectedAccountContainer,
);
const ProviderContainer = newStyledElement.div(styles.providerContainer);
const ConnectionButton = newStyledElement.div(styles.connectionButton);

async function connectAccount(
	provider: string,
	label: string,
	reloadUser: () => Promise<void>,
) {
	const toastId = toast.loading(`Conectando ${label}`);
	const response = await authenticatedFetchAsync(
		getAlbinaApiFullAddress(`/auth/me/external-logins/${provider}`),
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
		await reloadUser();
	} else if (result == "closed") {
		toast.error(`Conexão cancelada`, { id: toastId });
	} else {
		toast.error(`Falha ao conectar`, { id: toastId });
	}
}
async function disconnectAccount(
	provider: string,
	label: string,
	reloadUser: () => Promise<void>,
) {
	const toastId = toast.loading(`Desconectando ${label}`);
	const response = await authenticatedFetchAsync(
		getAlbinaApiFullAddress(`/auth/me/external-logins/${provider}`),
		{
			method: "DELETE",
		},
	);
	if (response.ok == false) {
		toast.error(`Falha ao desconectar`, { id: toastId });
		return;
	}
	toast.success(`Desconectado com sucesso`, { id: toastId });
	await reloadUser();
}

interface ConnectedAccuntProps {
	provider: string;
	label: string;
	icon: string;
}
export function ConnectedAccunt({
	provider,
	label,
	icon,
}: ConnectedAccuntProps) {
	const { externalLogins, reloadUser } = useCurrentUser();
	const connected: boolean =
		externalLogins == null ? false : externalLogins[provider] != undefined;

	return (
		<ConnectedAccountContainer>
			<ProviderContainer>
				<Image
					src={icon}
					alt={`${label}'s icon`}
					width={45}
					height={45}
				/>
				<p>{label}</p>
			</ProviderContainer>
			<ConnectionButton
				className={connected ? styles.connected : undefined}
				onClick={async () => {
					if (connected) await disconnectAccount(provider, label, reloadUser);
					else await connectAccount(provider, label, reloadUser);
				}}>
				{connected ? "Desconectar" : "Conectar"}
			</ConnectionButton>
		</ConnectedAccountContainer>
	);
}

function openOAuthPopup(
	url: string,
	windowName: string,
): Promise<"success" | "error" | "closed"> {
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
			if (event.data === "oauth-success") {
				cleanup();
				resolve("success");
			}
			if (event.data === "oauth-error") {
				cleanup();
				resolve("error");
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
