import styles from "./styles.module.css";
import { StateSwitch } from "@/components/(UTILS)";
import { useEffect, useState } from "react";
import { AccessLevel, Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import toast from "react-hot-toast";

interface IsPublicSwitchProps {
	characterId: Guid;
	characterAccessLevel: AccessLevel;
}
export function IsPublicSwitch({
	characterId,
	characterAccessLevel,
}: IsPublicSwitchProps) {
	const isPrivateState = useState(false);

	useEffect(() => {
		async function loadIsPublicState(characterId: string) {
			const response = await fetch(
				getAlbinaApiFullAddress(`/chars/${characterId}/is-public`),
				{
					method: "GET",
				},
			);
			if (response.ok) {
				isPrivateState[1](!(await response.json()).isPublic);
			}
		}
		loadIsPublicState(characterId);
	}, [characterId]);

	async function handleClick() {
		const toastId = toast.loading("Salvando...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/is-public`),
			{
				method: "PATCH",
				headers: [["content-type", "application/json"]],
				body: JSON.stringify({
					isPublic: isPrivateState[0],
				}),
			},
		);
		if (response.ok) toast.success("Salvo", { id: toastId });
		else toast.error("Salvamento falho", { id: toastId });
		return response.ok;
	}

	return (
		<StateSwitch
			className={styles.isPublicSwitchButton}
			onClickCheck={handleClick}
			state={isPrivateState}
			label="Privado"
			disabled={characterAccessLevel < AccessLevel.Owner}
		/>
	);
}
