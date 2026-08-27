"use client";

import { StpIcon } from "@/libs/stp@icons";
import styles from "./index.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { newStyledElement } from "@setsu-tp/styled-components";
import clsx from "clsx";
import toast from "react-hot-toast";
import {
	revalidatePathByClientSide,
	revalidateTagByClientSide,
} from "@/utils/ServerActions";
import { useRouter } from "next/navigation";

const SessionSwitchButton = newStyledElement.button(styles.sessionSwitchButton);

interface CampaignSessionManagerProps {
	campaign: Campaign;
	member: CampaignMember;
}
export function CampaignSessionManager({
	campaign,
	member,
}: CampaignSessionManagerProps) {
	const router = useRouter();

	async function handleStartSession() {
		const toastId = toast.loading("Iniciando Sessão...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaign.slug}/session/start`,
			{ method: "Post" },
		);
		if (!response.ok) {
			toast.error("Erro ao iniciar Sessão", { id: toastId });
			return;
		}
		toast.success("Sessão Iniciada", { id: toastId });
		await revalidateTagByClientSide("/campaigns");
		router.refresh();
	}
	async function handleEndSession() {
		const toastId = toast.loading("Terminando Sessão...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaign.slug}/session/end`,
			{ method: "Post" },
		);
		if (!response.ok) {
			toast.error("Erro ao terminar Sessão", { id: toastId });
			return;
		}
		toast.success("Sessão Terminada", { id: toastId });
		await revalidateTagByClientSide("/campaigns");
		router.refresh();
	}

	const activeStateStyle = campaign.isInSession
		? styles.active
		: styles.inactive;

	return (
		<UIBasics.Box
			backgroundColor="darkerGray"
			className={clsx(styles.indexContainer, activeStateStyle)}>
			{campaign.isInSession ? <p>Em Sessão</p> : <p>Fora de Sessão</p>}
			{member.isMaster && (
				<SessionSwitchButton
					className={activeStateStyle}
					onClick={
						campaign.isInSession ? handleEndSession : handleStartSession
					}>
					<StpIcon
						name="Power"
						color={campaign.isInSession ? "green" : "red"}
					/>
				</SessionSwitchButton>
			)}
		</UIBasics.Box>
	);
}
