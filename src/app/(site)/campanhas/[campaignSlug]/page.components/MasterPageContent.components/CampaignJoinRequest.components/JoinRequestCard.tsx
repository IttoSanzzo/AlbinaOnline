"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./JoinRequestCard.module.css";
import { CampaignJoinRequest } from "@/libs/stp@types";
import Image from "next/image";
import Link from "next/link";
import { StpIcon } from "@/libs/stp@icons";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import toast from "react-hot-toast";

const JoinRequestCardContainer = newStyledElement.div(
	styles.joinRequestCardContainer,
);
const IconContainer = newStyledElement.div(styles.iconContainer);
const Button = newStyledElement.button(styles.button);

interface JoinRequestCardProps {
	request: CampaignJoinRequest;
}
export function JoinRequestCard({ request }: JoinRequestCardProps) {
	async function handlerReject(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		event.preventDefault();
		const toastId = toast.loading("Rejeitando pedido...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${request.campaign!.slug}/join-requests/${request.userId}/reject`,
			{
				method: "Post",
			},
		);
		if (!response.ok) {
			toast.loading("A rejeição falhou", { id: toastId });
			return;
		}
		toast.success("Rejeitado", { id: toastId });
		window.location.reload();
	}
	async function handlerAccept(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		event.preventDefault();
		const toastId = toast.loading("Aceitando pedido...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${request.campaign!.slug}/join-requests/${request.userId}/accept`,
			{
				method: "Post",
			},
		);
		if (!response.ok) {
			toast.loading("A aceitação falhou", { id: toastId });
			return;
		}
		toast.success("Aceito", { id: toastId });
		window.location.reload();
	}

	return (
		<JoinRequestCardContainer>
			<IconContainer>
				<Link
					href={`/users/${request.user!.username}`}
					target="_blank"
					prefetch={false}>
					<Image
						src={request.user!.iconUrl}
						alt={`${request.user!.nickname}'s icon`}
						width={144}
						height={144}
					/>
				</Link>
			</IconContainer>
			<Button
				className={styles.rejectButton}
				onClick={handlerReject}>
				<StpIcon
					name="ThumbsDown"
					style="bold"
					color="red"
				/>
			</Button>
			<Button
				className={styles.acceptButton}
				onClick={handlerAccept}>
				<StpIcon
					name="ThumbsUp"
					style="bold"
					color="green"
				/>
			</Button>
		</JoinRequestCardContainer>
	);
}
