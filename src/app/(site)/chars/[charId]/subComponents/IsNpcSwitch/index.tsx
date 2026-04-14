import { Guid } from "@/libs/stp@types";
import styles from "./styles.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StateSwitch } from "@/components/(UTILS)";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const IsNpcSwitchNonEditable = newStyledElement.div(
	styles.isNpcSwitchNonEditable,
);

interface IsNpcSwitchProps {
	characterId: Guid;
	isNpc: boolean;
	isEditable: boolean;
}
export function IsNpcSwitch({
	characterId,
	isNpc,
	isEditable,
}: IsNpcSwitchProps) {
	const isPlayerState = useState<boolean>(!isNpc);

	useEffect(() => {
		isPlayerState[1](!isNpc);
	}, [isNpc]);

	async function handleClick() {
		const toastId = toast.loading("Salvando...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/is-npc`),
			{
				method: "PATCH",
				headers: [["content-type", "application/json"]],
				body: JSON.stringify({
					isNpc: isPlayerState[0],
				}),
			},
		);
		if (response.ok) toast.success("Salvo", { id: toastId });
		else toast.error("Salvamento falho", { id: toastId });
		return response.ok;
	}

	return isEditable ? (
		<StateSwitch
			label={isPlayerState[0] ? "Jogador" : "NPC"}
			style={{
				width: "110px",
				color: isPlayerState[0] ? "var(--cl-red-500)" : "var(--cl-gray-400)",
			}}
			state={isPlayerState}
			onClickCheck={handleClick}
		/>
	) : (
		<IsNpcSwitchNonEditable
			style={{
				color: isPlayerState[0] ? "var(--cl-red-500)" : "var(--cl-gray-400)",
			}}>
			{isPlayerState[0] ? "Jogador" : "NPC"}
		</IsNpcSwitchNonEditable>
	);
}
