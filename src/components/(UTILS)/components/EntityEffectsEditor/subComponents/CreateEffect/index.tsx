import { Dialog } from "@/libs/stp@radix";
import { newStyledElement } from "@setsu-tp/styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "./styles.module.css";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import z from "zod";
import { Guid } from "@/libs/stp@types";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import toast from "react-hot-toast";
import {
	revalidatePathByClientSide,
	revalidateTagByClientSide,
} from "@/utils/ServerActions";
import { EntityEffectEditTarget } from "../..";
import { StpIcon } from "@/libs/stp@icons";

const LinkEffectButton = newStyledElement.button(styles.linkEffectButton);
const SetDefaultEffectNamebutton = newStyledElement.button(
	styles.setDefaultEffectNamebutton,
);

const schema = z.object({
	name: z.string().min(1, "Must be at least 1 character long"),
	role: z.string(),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface CreateEffectProps {
	pathname: string;
	targetId: Guid;
	targetType: EntityEffectEditTarget;
	defaultName?: string;
	setShouldFocusOnLastEditor: Dispatch<SetStateAction<boolean>>;
}
export function CreateEffect({
	pathname,
	targetId,
	targetType,
	defaultName,
	setShouldFocusOnLastEditor,
}: CreateEffectProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		defaultValues: { name: undefined, role: "" },
	});

	async function onSubmit(data: FormData) {
		const bodyEffect = {
			name: data.name,
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
			setError(
				`Creation Failed: ${response.status} ${
					response.statusText
				} : ${await response.text()}`,
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
			setError(
				`Link Failed: ${responseLink.status} ${
					responseLink.statusText
				} : ${await responseLink.text()}`,
			);
			return;
		}
		toast.success("Linked", { id: toastId });
		setError("");
		setOpenState(false);
		revalidatePathByClientSide(pathname);
		revalidateTagByClientSide("/effects");
		setShouldFocusOnLastEditor(true);
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
						{defaultName && (
							<SetDefaultEffectNamebutton
								type="button"
								onClick={(event) => {
									event.preventDefault();
									form.setValue("name", defaultName, {
										shouldDirty: true,
										shouldTouch: true,
										shouldValidate: true,
									});
								}}>
								<StpIcon
									name="Tag"
									color="default"
									style="bold"
								/>
							</SetDefaultEffectNamebutton>
						)}
						<HookedForm.TextInput
							fieldName="name"
							label="Name"
							placeholder={"Name"}
							autoFocus={true}
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
