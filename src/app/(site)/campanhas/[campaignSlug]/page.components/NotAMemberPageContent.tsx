"use client";

import styles from "./NotAMemberPageContent.module.css";
import { GenericInfoMultiColumn } from "@/components/(Design)/components/GenericInfoMultiColumn";
import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { useCurrentCampaignMember, useCurrentUser } from "@/libs/stp@hooks";
import { Campaign } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { revalidateTagByClientSide } from "@/utils/ServerActions";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const JoinButton = newStyledElement.button(styles.joinButton);

interface NotAMemberPageContentProps {
	campaign: Campaign;
}
export function NotAMemberPageContent({
	campaign,
}: NotAMemberPageContentProps) {
	const { loading, user } = useCurrentUser();
	const { reloadMember } = useCurrentCampaignMember();
	const router = useRouter();

	if (loading || user == null) return <LoadingCircle centralizeVertical={18} />;

	const campaignIsFull =
		campaign.maxPlayers > 0 && campaign.playerCount >= campaign.maxPlayers;
	const canEnterDirectly = !campaignIsFull && campaign.isOpen;
	const enterTitleColor: keyof typeof StandartTextColor | undefined =
		campaignIsFull ? "red" : undefined;
	const enterTextColor: keyof typeof StandartTextColor | undefined =
		campaignIsFull ? "red" : canEnterDirectly ? "green" : undefined;

	async function handleJoinCampaign(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		event.preventDefault();
		const toastId = toast.loading("Entrando na campanha...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaign.slug}/join`,
			{
				method: "Post",
				body: JSON.stringify({
					campaignId: campaign.id,
					campaignSlug: campaign.slug,
					userId: user!.id,
				}),
				headers: { "Content-Type": "application/json" },
			},
		);
		if (!response.ok) {
			toast.error("Erro ao tentar entrar na campanha", { id: toastId });
			return;
		}
		toast.success("Entrou na campanha", { id: toastId });
		await revalidateTagByClientSide("/campaigns");
		await reloadMember(campaign.slug);
		router.refresh();
	}
	async function handleJoinRequest(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		event.preventDefault();
		const toastId = toast.loading("Criando pedido...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaign.slug}/join-requests`,
			{ method: "Post" },
		);
		if (!response.ok) {
			if (
				(await response.text()) ==
				'"Already has a request to the targeted campaign"'
			) {
				toast.success("Pedido já existente", { id: toastId });
				router.push("/campanhas");
				return;
			}
			toast.error("Erro ao criar pedido", { id: toastId });
			return;
		}
		toast.success("Pedido criado", { id: toastId });
		router.push("/campanhas");
	}

	return (
		<>
			<UIBasics.Box backgroundColor="darkGray">
				<UIBasics.Header
					textAlign="center"
					textColor={enterTitleColor ?? "yellow"}>
					Entrar na Campanha
				</UIBasics.Header>
				<UIBasics.Text
					textColor={enterTextColor ?? "gray"}
					textAlign="center">
					{`Você ainda não faz parte dessa campanha${campaignIsFull ? ", e ela já atingiu seu limite de jogadores." : `${canEnterDirectly ? ". Para entrar, basta apertar o botão abaixo:" : ". Solicite sua entrada apertando o botão abaixo:"}`}`}
				</UIBasics.Text>
				{!campaignIsFull && (
					<>
						{canEnterDirectly ? (
							<JoinButton
								className={styles.direct}
								onClick={handleJoinCampaign}>
								Entrar
							</JoinButton>
						) : (
							<JoinButton
								className={styles.indirect}
								onClick={handleJoinRequest}>
								Pedir para Entrar
							</JoinButton>
						)}
					</>
				)}
			</UIBasics.Box>
			<DynamicGallery
				url={getAlbinaApiFullAddress(`/gallery/campaigns/${campaign.slug}`)}
				hideIfEmpty
			/>
			<GenericInfoMultiColumn
				info={campaign.info}
				hideIfEmpty
			/>
		</>
	);
}
