import { FullUser, Guid } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { StyledLinkCard } from "@/components/(Design)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";

const CharacterForbiddenContainer = newStyledElement.div(
	styles.characterForbiddenContainer,
);

interface CharacterForbiddenProps {
	characterId: Guid;
}
export function CharacterForbidden({ characterId }: CharacterForbiddenProps) {
	const [owner, setOwner] = useState<FullUser | null>(null);

	useEffect(() => {
		authenticatedFetchAsync(`/chars/${characterId}/owner`, {
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
	}, [characterId]);

	return (
		<CharacterForbiddenContainer>
			<UIBasics.Header textColor="red">
				Você não possui permissão para acessar essa ficha
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
		</CharacterForbiddenContainer>
	);
}
