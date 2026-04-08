import { FullUser, Guid } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { StyledLinkCard } from "@/components/(Design)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";

const NpcForbiddenContainer = newStyledElement.div(
	styles.npcForbiddenContainer,
);

interface NpcForbiddenProps {
	npcId: Guid;
}
export function NpcForbidden({ npcId }: NpcForbiddenProps) {
	const [owner, setOwner] = useState<FullUser | null>(null);

	useEffect(() => {
		authenticatedFetchAsync(`/npcs/${npcId}/owner`, {
			method: "GET",
		}).then((response) => {
			if (!response.ok) {
				return;
			} else {
				response.json().then((data) => {
					setOwner(data.user);
				});
			}
		});
	}, [npcId]);

	return (
		<NpcForbiddenContainer>
			<UIBasics.Header textColor="red">
				Você não possui permissão para acessar esse npc
			</UIBasics.Header>
			<UIBasics.Header
				headerType="h2"
				textColor="gray">
				Solicite acesso ao dono
			</UIBasics.Header>
			{owner != null ? (
				<StyledLinkCard
					href={`/users/${owner.username}`}
					title={owner.nickname}
					artworkUrl={getAlbinaApiFullAddress(
						`/favicon/users/${owner.username}`,
					)}
				/>
			) : (
				<StyledLinkCard
					href={`/users`}
					title={"Users"}
					artworkUrl={getAlbinaApiFullAddress(`/favicon/users`)}
				/>
			)}
		</NpcForbiddenContainer>
	);
}
