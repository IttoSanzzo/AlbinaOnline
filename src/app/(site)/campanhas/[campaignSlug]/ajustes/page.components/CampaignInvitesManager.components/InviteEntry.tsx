import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./InviteEntry.module.css";
import { CampaignInvite, FullUser } from "@/libs/stp@types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { UIBasics } from "@/components/(UIBasics)";
import {
	getAlbinaApiFullAddress,
	getAlbinaOnlineFullAddress,
} from "@/utils/AlbinaApi";
import Link from "next/link";
import { StpIcon } from "@/libs/stp@icons";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";

const InviteEntryWrapper = newStyledElement.div(styles.inviteEntryWrapper);
const InviteEntryContainer = newStyledElement.div(styles.inviteEntryContainer);
const IconContainer = newStyledElement.div(styles.iconContainer);
const SubContainer = newStyledElement.div(styles.subContainer);
const ButtonsContainer = newStyledElement.div(styles.buttonsContainer);
const DeleteButton = newStyledElement.button(styles.deleteButton);
const ShareButton = newStyledElement.button(styles.shareButton);

interface InviteEntryProps {
	campaignSlug: string;
	invite: CampaignInvite;
	setInvites: Dispatch<SetStateAction<CampaignInvite[]>>;
}
export function InviteEntry({
	campaignSlug,
	invite,
	setInvites,
}: InviteEntryProps) {
	const [user, setUser] = useState<FullUser | null>(null);

	useEffect(() => {
		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress(`/campaigns/members/${invite.memberId}/user`),
			);
			if (!response.ok) return;
			setUser(await response.json());
		})();
	}, [invite]);

	async function handleDeleteInvite() {
		const toastId = toast.loading("Deletando convite...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaignSlug}/invites/${invite.id}`,
			{
				method: "Delete",
			},
		);
		if (!response.ok) {
			toast.error("Erro ao deletar convite", { id: toastId });
			return;
		}
		toast.success("Convite deletado", { id: toastId });
		setInvites((state) => [...state.filter((x) => x.id != invite.id)]);
	}
	async function handleShareInvite() {
		const inviteUrl = getAlbinaOnlineFullAddress(
			`/campanhas/convite?token=${invite.id}`,
		);
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Convite para campanha",
					text: "Você foi convidado para uma campanha no Albina!",
					url: inviteUrl,
				});
				return;
			} catch {
				return;
			}
		} else {
			toast.success("Link de convite copiado");
			await navigator.clipboard.writeText(inviteUrl);
		}
	}

	return (
		<InviteEntryWrapper>
			<InviteEntryContainer>
				<IconContainer>
					<Link
						href={`/users/${user?.username ?? ""}`}
						target="_blank"
						prefetch={false}>
						<Image
							src={
								user?.iconUrl ?? getAlbinaApiFullAddress(`/favicon/not-found`)
							}
							alt=""
							height={44}
							width={44}
						/>
					</Link>
				</IconContainer>
				<SubContainer
					title={new Date(invite.createdAt).toLocaleString("pt-BR", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					})}>
					<UIBasics.Text textColor="gray">{`Criado:`}</UIBasics.Text>
					<UIBasics.Text textColor="blue">
						{new Date(invite.createdAt).toLocaleString("pt-BR", {
							dateStyle: "short",
						})}
					</UIBasics.Text>
				</SubContainer>
				<SubContainer>
					<UIBasics.Text textColor="gray">{`Usos:`}</UIBasics.Text>
					<UIBasics.Text textColor="green">{`${invite.usedCount} / ${invite.maxUses}`}</UIBasics.Text>
				</SubContainer>
				<ButtonsContainer>
					<DeleteButton onClick={handleDeleteInvite}>
						<StpIcon
							name="Trash"
							color="black"
						/>
					</DeleteButton>
					<ShareButton onClick={handleShareInvite}>
						<StpIcon
							name="ShareFat"
							color="white"
						/>
					</ShareButton>
				</ButtonsContainer>
			</InviteEntryContainer>
		</InviteEntryWrapper>
	);
}
