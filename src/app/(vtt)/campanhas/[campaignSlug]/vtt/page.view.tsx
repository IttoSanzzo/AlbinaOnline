"use client";

import styles from "./page.module.css";
import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import { UIBasics } from "@/components/(UIBasics)";
import { useVttWebSocket } from "@/libs/stp@hooks/hooks/useVttWebSocket";
import { Campaign } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface VttPageViewProps {
	campaign: Campaign;
}

export default function VttPageView({ campaign }: VttPageViewProps) {
	const { connecting, vttId, closeMessage } = useVttWebSocket(campaign.id);

	if (connecting || closeMessage === undefined) return <VttLoadingView />;
	switch (closeMessage ?? "None") {
		case "None":
			return <>Conectado</>;
		case "Already Connected":
		case "Disconnected By Other Client":
			return <VttAlreadyConnectedView vttId={vttId!} />;
		case "Not A Member":
			return <VttNotMemberView campaignSlug={campaign.slug} />;
		case "Closed Normally":
			return <VttClosedNormallyView campaignSlug={campaign.slug} />;
		default:
			return <VttErrorView closeMessage={closeMessage!} />;
	}
}

function VttLoadingView() {
	return <LoadingCircle centralizeVertical={23} />;
}

// Already Connected ///////////////////////////////////////////////////////////
const AlreadyConnectedContainer = newStyledElement.div(
	styles.alreadyConnectedContainer,
);
const AlreadyConnectedButton = newStyledElement.button(
	styles.alreadyConnectedButton,
);
function VttAlreadyConnectedView({ vttId }: { vttId: string }) {
	return (
		<AlreadyConnectedContainer>
			<UIBasics.Text textColor="lightGray">
				Você já está conectado a esse VTT em outro cliente
			</UIBasics.Text>
			<UIBasics.Text textColor="lightGray">
				Deseja desconectá-lo, para reconectar-se por aqui?
			</UIBasics.Text>
			<AlreadyConnectedButton
				onClick={async () => {
					const toastId = toast.loading("Desconectando outro cliente...");
					const response = await authenticatedFetchAsync(
						`/sockets/vtt/${vttId}/clients/me`,
						{
							method: "DELETE",
						},
					);
					if (!response.ok) {
						toast.error("Falha ao desconectar outro cliente", { id: toastId });
						return;
					}
					toast.success("Cliente antigo desconectado, recarregando...", {
						id: toastId,
					});
					window.location.reload();
				}}>
				Forçar Conexão
			</AlreadyConnectedButton>
		</AlreadyConnectedContainer>
	);
}
// Not A Member ////////////////////////////////////////////////////////////////
function VttNotMemberView({ campaignSlug }: { campaignSlug: string }) {
	const router = useRouter();
	useEffect(() => {
		router.push(`/campanhas/${campaignSlug}`);
	}, [campaignSlug, router]);
	return null;
}
// Closed Normally /////////////////////////////////////////////////////////////
function VttClosedNormallyView({ campaignSlug }: { campaignSlug: string }) {
	const router = useRouter();
	useEffect(() => {
		router.push(`/campanhas/${campaignSlug}`);
	}, [campaignSlug, router]);
	return null;
}
// Error ///////////////////////////////////////////////////////////////////////
const ErrorContainer = newStyledElement.div(styles.errorContainer);
function VttErrorView({ closeMessage }: { closeMessage: string }) {
	return (
		<ErrorContainer>
			<p>{closeMessage}</p>
		</ErrorContainer>
	);
}
