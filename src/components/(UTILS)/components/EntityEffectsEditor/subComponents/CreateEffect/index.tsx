import { Dialog } from "@/libs/stp@radix";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useState } from "react";
import styles from "./styles.module.css";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import z from "zod";
import { Guid } from "@/libs/stp@types";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import toast from "react-hot-toast";
import { revalidatePathByClientSide } from "@/utils/ServerActions";
import { EntityEffectEditTarget } from "../..";

const LinkEffectButton = newStyledElement.button(styles.linkEffectButton);

const schema = z.object({
	name: z.string().min(1, "Must be at least 1 character long"),
	role: z.string().min(1, "Must be at least 1 character long"),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface CreateEffectProps {
	pathname: string;
	targetId: Guid;
	targetType: EntityEffectEditTarget;
	revalidatePath?: string;
}
export function CreateEffect({
	pathname,
	targetId,
	targetType,
	revalidatePath,
}: CreateEffectProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(data: FormData) {
		const bodyEffect = {
			name: data.name,
		};
		const toastId = toast.loading("Creating...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress("/effects"),
			{
				method: "POST",
				body: JSON.stringify(bodyEffect),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			toast.error("Creation failed", { id: toastId });
			setError(
				`Creation Failed: ${response.status} ${
					response.statusText
				} : ${await response.text()}`
			);
			return;
		}
		const effect = await response.json();
		toast.loading("Linking...", { id: toastId });
		const bodyLink = {
			effectId: effect.id as Guid,
			targetId: targetId,
			targetType: targetType,
			role: data.role,
		};
		const responseLink = await authenticatedFetchAsync(
			getAlbinaApiAddress("/effect-links"),
			{
				method: "POST",
				body: JSON.stringify(bodyLink),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!responseLink.ok) {
			toast.error("Link failed", { id: toastId });
			setError(
				`Link Failed: ${responseLink.status} ${
					responseLink.statusText
				} : ${await responseLink.text()}`
			);
			return;
		}
		toast.success("Linked", { id: toastId });
		setError("");
		setOpenState(false);
		revalidatePathByClientSide(pathname);
		if (revalidatePath) revalidatePathByClientSide(revalidatePath);
	}

	return (
		<Dialog.Root
			open={openState}
			onOpenChange={setOpenState}>
			<Dialog.Trigger asChild>
				<LinkEffectButton>Create new Effect</LinkEffectButton>
			</Dialog.Trigger>
			<Dialog.Overlay style={{ zIndex: 10 }}>
				<Dialog.Content>
					<Dialog.Title>Create Effect</Dialog.Title>
					<Dialog.Description></Dialog.Description>
					<HookedForm.Form
						form={form}
						onSubmit={onSubmit}>
						<HookedForm.TextInput
							fieldName="name"
							label="Name"
							placeholder={"Name"}
						/>
						<HookedForm.TextInput
							fieldName="role"
							label="Role"
							placeholder={"Primário | Secundário | ..."}
						/>
						<HookedForm.SubmitButton label="Link" />
						<HookedForm.SimpleMessage
							color="red"
							message={error}
						/>
					</HookedForm.Form>
				</Dialog.Content>
			</Dialog.Overlay>
		</Dialog.Root>
	);
}
