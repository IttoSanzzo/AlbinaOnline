"use client";

import styles from "./page.module.css";
import { GenericPageContainer } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { useCurrentUser } from "@/libs/stp@hooks";
import { StpIcon } from "@/libs/stp@icons";
import { Campaign, CampaignInvite, FullUser } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { newStyledElement } from "@setsu-tp/styled-components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const InviteContainer = newStyledElement.div(styles.inviteContainer);
const BannerContainer = newStyledElement.div(styles.bannerContainer);
const IconContainer = newStyledElement.div(styles.iconContainer);
const InviteMessageBox = newStyledElement.div(styles.inviteMessageBox);
const AcceptButton = newStyledElement.button(styles.acceptButton);

interface ConvitePageViewProps {
	invite: CampaignInvite;
	campaign: Campaign;
	invictor: FullUser;
}
export default function ConvitePageView({
	invite,
	campaign,
	invictor,
}: ConvitePageViewProps) {
	const router = useRouter();
	const { loading, user } = useCurrentUser();
	const [isMember, setIsMember] = useState<boolean>(true);

	useEffect(() => {
		if (loading || user == null) return;

		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress(
					`/campaigns/${campaign.slug}/members/${user.id}`,
				),
			);
			if (!response.ok) {
				setIsMember(false);
				return;
			}
			toast.success("Você já é um membro dessa campanha");
			router.push(`/campanhas/${campaign.slug}`);
		})();
	}, [loading, user, campaign]);

	async function handleUseInvite() {
		const toastId = toast.loading("Aceitando...");
		const response = await authenticatedFetchAsync(
			`/campaigns/invites/${invite.id}/use`,
			{
				method: "Post",
			},
		);
		if (!response.ok) {
			toast.error("Ocorreu um erro ao tentar aceitar o convite", {
				id: toastId,
			});
			return;
		}
		toast.success("Convite aceito", { id: toastId });
		router.push(`/campanhas/${campaign.slug}`);
	}

	return (
		<GenericPageContainer
			title={`Convite para ${campaign.name}`}
			icon={campaign.iconUrl}
			banner={campaign.bannerUrl}>
			<InviteContainer>
				<BannerContainer>
					<Image
						src={invictor.bannerUrl}
						alt=""
						width={490}
						height={200}
					/>
				</BannerContainer>
				<IconContainer>
					<Image
						src={invictor.iconUrl}
						alt=""
						width={140}
						height={140}
					/>
				</IconContainer>
				<InviteMessageBox>
					<UIBasics.Text textColor="gray">
						{"Você recebeu um convite de "}
					</UIBasics.Text>
					<Link
						href={`/users/${invictor.username}`}
						target="_blank"
						prefetch={false}>
						{invictor.nickname}
					</Link>
					<UIBasics.Text textColor="gray">
						{" para entrar na campanha "}
					</UIBasics.Text>
					<Link
						href={`/campanhas/${campaign.slug}`}
						target="_blank"
						prefetch={false}>
						{campaign.name}
					</Link>
					<UIBasics.Text textColor="gray">
						{". Para aceitar, aperte no botão abaixo:"}
					</UIBasics.Text>
				</InviteMessageBox>
				<AcceptButton
					onClick={handleUseInvite}
					disabled={isMember}>
					<StpIcon
						name="DoorOpen"
						style="bold"
						color="white"
					/>
				</AcceptButton>
			</InviteContainer>
		</GenericPageContainer>
	);
}
