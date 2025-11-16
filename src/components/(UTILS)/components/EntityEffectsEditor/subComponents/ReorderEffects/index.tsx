import { Dialog } from "@/libs/stp@radix";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useState } from "react";
import styles from "./styles.module.css";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import z from "zod";
import { GenericEffect, Guid } from "@/libs/stp@types";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import toast from "react-hot-toast";
import { revalidatePathByClientSide } from "@/utils/ServerActions";
import { EntityEffectEditTarget } from "../..";

const ReorderEffectsButton = newStyledElement.button(
	styles.reorderEffectsButton
);

interface ReorderEffectsProps {
	effects: GenericEffect[];
	pathname: string;
	targetId: Guid;
	targetType: EntityEffectEditTarget;
	revalidatePath?: string;
}
export function ReorderEffects({
	effects,
	pathname,
	targetId,
	targetType,
	revalidatePath,
}: ReorderEffectsProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const schema = z.object({
		newOrder: z
			.array(
				z
					.number()
					.int()
					.min(0)
					.max(effects.length - 1)
			)
			.length(effects.length)
			.refine(
				(arr) => new Set(arr).size === arr.length,
				"Order numbers must be unique"
			),
	});
	type FormData = z.infer<typeof schema>;

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { newOrder: Array(effects.length).fill(0) },
	});

	async function onSubmit(data: FormData) {
		const body = {
			targetId: targetId,
			targetType: targetType,
			newOrder: data.newOrder,
		};
		const toastId = toast.loading("Reordening...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress("/effect-links/reorder"),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			toast.error("Reorder failed", { id: toastId });
			setError(
				`Reorder Failed: ${response.status} ${
					response.statusText
				} : ${await response.text()}`
			);
			return;
		}
		toast.success("Reordened", { id: toastId });
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
				<ReorderEffectsButton>Reorder Effects</ReorderEffectsButton>
			</Dialog.Trigger>
			<Dialog.Overlay style={{ zIndex: 10 }}>
				<Dialog.Content>
					<Dialog.Title>Reorder Effects</Dialog.Title>
					<Dialog.Description></Dialog.Description>
					<HookedForm.Form
						form={form}
						onSubmit={onSubmit}>
						{effects.map((effect, index) => (
							<HookedForm.NumberInput
								key={effect.id}
								label={`${effect.order} : ${effect.role ?? "NO_ROLE"} - ${
									effect.name
								}`}
								fieldName={`newOrder.${index}`}
							/>
						))}
						<HookedForm.SubmitButton label="Reorder" />
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
