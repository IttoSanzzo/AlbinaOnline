import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./MemberEntry.module.css";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { useState } from "react";
import Image from "next/image";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import Link from "next/link";
import { StpIcon } from "@/libs/stp@icons";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { AlertDialog } from "@/libs/stp@radix";

const MemberEntryWrapper = newStyledElement.div(styles.memberEntryWrapper);
const MemberEntryContainer = newStyledElement.div(styles.memberEntryContainer);
const IconContainer = newStyledElement.div(styles.iconContainer);
const SubContainer = newStyledElement.div(styles.subContainer);
const ButtonsContainer = newStyledElement.div(styles.buttonsContainer);

interface MemberEntryProps {
	campaign: Campaign;
	member: CampaignMember;
	isCurrent: boolean;
}
export function MemberEntry({ campaign, member, isCurrent }: MemberEntryProps) {
	async function handleMemberMasterStateChange(newState: boolean) {
		const toastId = toast.loading("Processando...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaign.slug}/members/${member.userId}`,
			{
				method: "Put",
				body: JSON.stringify({
					targetUserId: member.userId,
					newMasterState: newState,
				}),
				headers: { "Content-Type": "application/json" },
			},
		);
		if (!response.ok) {
			toast.error("Erro ao processar", { id: toastId });
			return;
		}
		toast.success("Processado", { id: toastId });
		window.location.reload();
	}
	async function handleMemberRemoval() {
		const toastId = toast.loading("Removendo membro...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaign.slug}/members/${member.userId}`,
			{ method: "Delete" },
		);
		if (!response.ok) {
			toast.error("Erro ao remover membro", { id: toastId });
			return;
		}
		toast.success("Membro removido", { id: toastId });
		window.location.reload();
	}

	return (
		<MemberEntryWrapper>
			<MemberEntryContainer>
				<IconContainer>
					<Link
						href={`/users/${member.user.username}`}
						target="_blank"
						prefetch={false}>
						<Image
							src={
								member.user.iconUrl ??
								getAlbinaApiFullAddress(`/favicon/not-found`)
							}
							alt=""
							height={44}
							width={44}
						/>
					</Link>
				</IconContainer>
				<SubContainer
					title={new Date(member.createdAt).toLocaleString("pt-BR", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					})}>
					<UIBasics.Text textColor="gray">{`Entrou:`}</UIBasics.Text>
					<UIBasics.Text textColor="blue">
						{new Date(member.createdAt).toLocaleString("pt-BR", {
							dateStyle: "short",
						})}
					</UIBasics.Text>
				</SubContainer>
				<SubContainer>
					<UIBasics.Text textColor={member.isMaster ? "purple" : "green"}>
						{member.isMaster ? "Mestre" : "Jogador"}
					</UIBasics.Text>
				</SubContainer>
				<ButtonsContainer>
					{isCurrent ? (
						<ManageMemberDialog
							type="demote"
							action={async () => await handleMemberMasterStateChange(false)}
							disabled={campaign.masterCount < 2}
							title={
								campaign.masterCount < 2
									? "Deve haver pelo menos 1 mestre em uma campanha"
									: undefined
							}
							alertTitle="Demotar a Jogador"
							description="Se rebaixar a jogador? Apenas um mestre poderá te promover de volta à posição de mestre."
							confirmMessage="Demotar"
						/>
					) : (
						member.isMaster == false && (
							<>
								<ManageMemberDialog
									type="remove"
									action={async () => await handleMemberRemoval()}
									alertTitle="Remover da Campanha"
									description="Remover esse jogador da campanha? Ele poderá entrar novamenta mas, todos os registros de sua existência serão deletados sem volta."
									confirmMessage="Remover"
								/>
								<ManageMemberDialog
									type="promote"
									action={async () => await handleMemberMasterStateChange(true)}
									alertTitle="Promover a Mestre"
									description="Promover esse jogador a mestre? Você não poderá desfazer essa ação. Apenas um mestre pode escolher se tornar jogador."
									confirmMessage="Promover"
								/>
							</>
						)
					)}
				</ButtonsContainer>
			</MemberEntryContainer>
		</MemberEntryWrapper>
	);
}

interface ManageMemberDialogProps {
	action: () => Promise<void>;
	description: string;
	confirmMessage: string;
	type: "promote" | "demote" | "remove";
	disabled?: boolean;
	title?: string;
	alertTitle: string;
}
export function ManageMemberDialog({
	action,
	confirmMessage,
	description,
	type,
	disabled,
	title,
	alertTitle,
}: ManageMemberDialogProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const color =
		type == "promote"
			? StandartTextColor["yellow"]
			: type == "demote"
				? StandartTextColor["gray"]
				: StandartTextColor["red"];
	return (
		<AlertDialog.Root
			open={isOpen}
			onOpenChange={setIsOpen}>
			<AlertDialog.Trigger
				className={styles[`${type}Button`]}
				disabled={disabled}
				title={title}>
				<StpIcon
					name={
						type == "promote"
							? "ArrowFatUp"
							: type == "demote"
								? "ArrowFatDown"
								: "Trash"
					}
					color="black"
				/>
			</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay onClick={() => setIsOpen(false)} />
				<AlertDialog.Content>
					<AlertDialog.Title
						style={{
							color: color,
						}}
						textAlign="center">
						{alertTitle}
					</AlertDialog.Title>
					<AlertDialog.Description style={{ textAlign: "center" }}>
						{description}
					</AlertDialog.Description>
					<AlertDialog.ButtonsContainer alignment="space-around">
						<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
						<AlertDialog.Action
							color="blue"
							onClick={async () => {
								await action();
							}}>
							{confirmMessage}
						</AlertDialog.Action>
					</AlertDialog.ButtonsContainer>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
