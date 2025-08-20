import { Dialog } from "@/libs/stp@radix";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useState } from "react";
import styles from "./styles.module.css";
import { HookedForm, zGuid } from "@/libs/stp@forms";
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
	effectId: zGuid(),
	role: z.string().min(1, "Must be at least 1 character long"),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface LinkEffectProps {
	pathname: string;
	targetId: Guid;
	targetType: EntityEffectEditTarget;
	revalidatePath?: string;
}
export function LinkEffect({
	pathname,
	targetId,
	targetType,
	revalidatePath,
}: LinkEffectProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, any, FormData>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(data: FormData) {
		const body = {
			effectId: data.effectId as Guid,
			targetId: targetId,
			targetType: targetType,
			role: data.role,
		};
		const toastId = toast.loading("Linking...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress("/effect-links"),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			toast.error("Link failed", { id: toastId });
			setError(
				`Link Failed: ${response.status} ${
					response.statusText
				} : ${await response.text()}`
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
				<LinkEffectButton>Link existing Effect</LinkEffectButton>
			</Dialog.Trigger>
			<Dialog.Overlay style={{ zIndex: 10 }}>
				<Dialog.Content>
					<Dialog.Title>Link Effect</Dialog.Title>
					<Dialog.Description></Dialog.Description>
					<HookedForm.Form
						form={form}
						onSubmit={onSubmit}>
						<HookedForm.TextInput
							fieldName="effectId"
							label="Effect Id"
							placeholder={Guid.Empty}
						/>
						<HookedForm.TextInput
							fieldName="role"
							label="Effect Role"
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
