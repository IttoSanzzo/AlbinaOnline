import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Guid } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import toast from "react-hot-toast";
import {
	revalidatePathByClientSide,
	revalidateTagByClientSide,
} from "@/utils/ServerActions";
import { EntityEffectEditTarget } from "../..";
import { Dispatch, SetStateAction } from "react";

const FastCreateEffectButton = newStyledElement.button(
	styles.fastCreateEffectButton,
);

interface FastCreateEffectProps {
	pathname: string;
	targetId: Guid;
	targetType: EntityEffectEditTarget;
	name: string;
	setShouldFocusOnLastEditor: Dispatch<SetStateAction<boolean>>;
}
export function FastCreateEffect({
	pathname,
	targetId,
	targetType,
	name,
	setShouldFocusOnLastEditor,
}: FastCreateEffectProps) {
	async function handleClick() {
		const bodyEffect = {
			name: name,
		};
		const toastId = toast.loading("Creating...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress("/effects"),
			{
				method: "POST",
				body: JSON.stringify(bodyEffect),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			toast.error("Creation failed", { id: toastId });
			return;
		}
		const effect = await response.json();
		toast.loading("Linking...", { id: toastId });
		const bodyLink = {
			effectId: effect.id as Guid,
			targetId: targetId,
			targetType: targetType,
			role: "",
		};
		const responseLink = await authenticatedFetchAsync(
			getAlbinaApiFullAddress("/effect-links"),
			{
				method: "POST",
				body: JSON.stringify(bodyLink),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!responseLink.ok) {
			toast.error("Link failed", { id: toastId });
			return;
		}
		toast.success("Linked", { id: toastId });
		revalidatePathByClientSide(pathname);
		revalidateTagByClientSide("/effects");
		setShouldFocusOnLastEditor(true);
	}

	return (
		<FastCreateEffectButton
			onClick={(event) => {
				event.preventDefault();
				handleClick();
			}}>
			Create Default Effect
		</FastCreateEffectButton>
	);
}
