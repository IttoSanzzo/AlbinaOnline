import { GenericEffect, GenericEffectContent } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm, SelectOption, zJsonStringTyped } from "@/libs/stp@forms";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { UIBasics } from "@/components/(UIBasics)";
import { UnlinkEffectButton } from "./subComponents/UnlinkEffectButton";
import { DeleteEffectButton } from "./subComponents/DeleteEffectButton";
import { revalidatePathByClientSide } from "@/utils/ServerActions";
import { capitalize } from "@/utils/StringUtils";
import { ChangeEffectRole } from "./subComponents/ChangeEffectRole";

const GenericEffectContentArraySchema = z.array(
	z.object({
		type: z.string(),
		value: z.string(),
		color: z.string(),
		tableData: z.any().nullable(),
	})
);

const schema = z.object({
	name: z.string().min(1, "Must be at leat 1 character long"),
	color: z.string(),
	contents: zJsonStringTyped<GenericEffectContent[]>(
		GenericEffectContentArraySchema
	),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

const GenericEffectEditorContainer = newStyledElement.div(
	styles.genericEffectEditorContainer
);

interface GenericEffectEditorProps {
	genericEffect: GenericEffect;
	pathname: string;
	revalidatePath?: string;
}
export function GenericEffectEditor({
	genericEffect,
	pathname,
	revalidatePath,
}: GenericEffectEditorProps) {
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: genericEffect.name,
			color: genericEffect.color ?? "Default",
			contents: JSON.stringify(genericEffect.contents, null, 2) ?? "[]",
		},
	});

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/effects/${genericEffect.id}`),
			{
				method: "PUT",
				body: JSON.stringify(formData),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			toast.error("Saving failed", { id: toastId });
			setError("");
			return;
		}
		toast.success("Saved", { id: toastId });
		revalidatePathByClientSide(pathname);
		if (revalidatePath) revalidatePathByClientSide(revalidatePath);
	}

	const colorOptions: SelectOption[] = [
		"Default",
		"Gray",
		"DarkGray",
		"Brown",
		"Orange",
		"Yellow",
		"Green",
		"Blue",
		"Purple",
		"Pink",
		"Red",
	].map((color) => ({
		name: capitalize(color),
		value: color,
	}));

	return (
		<GenericEffectEditorContainer>
			<UIBasics.Box
				backgroundColor="gray"
				flexDirection="row"
				justifyContent="space-between">
				<div style={{ display: "flex", flexDirection: "column" }}>
					<UIBasics.Text
						textColor="blue"
						children={`EffectId: ${genericEffect.id}`}
					/>
					<UIBasics.Text
						textColor="blue"
						children={`LinkId: ${genericEffect.effectLinkId}`}
					/>
					<UIBasics.Text
						textColor="blue"
						children={`Order: ${genericEffect.order}`}
					/>
				</div>
				<div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
					<UnlinkEffectButton
						safetyText={genericEffect.name ?? "IM SURE"}
						linkId={genericEffect.effectLinkId}
						pathname={pathname}
						revalidatePath={revalidatePath}
					/>
					<DeleteEffectButton
						safetyText={genericEffect.name ?? "IM SURE"}
						effectId={genericEffect.id}
						pathname={pathname}
						revalidatePath={revalidatePath}
					/>
				</div>
			</UIBasics.Box>
			<ChangeEffectRole
				genericEffect={genericEffect}
				pathname={pathname}
				revalidatePath={revalidatePath}
			/>
			<HookedForm.Space height={5} />
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<HookedForm.TextInput<FormData>
					labelBackground="gray"
					fieldName="name"
					label="Name *"
				/>
				<HookedForm.Select<FormData>
					fieldName="color"
					options={colorOptions}
					label="Color *"
				/>
				<HookedForm.TextAreaInput<FormData>
					labelBackground="gray"
					fieldName="contents"
					label="Contents *"
					height={500}
					placeholder={
						'[\n\t{\n\t\t"type": "Quote | Table",\n\t\t"color": null,\n\t\t"value": "..."\n\t},\n\t{\n\t\t...\n\t}\n]'
					}
				/>

				<HookedForm.SubmitButton label="Salvar" />
				<HookedForm.SimpleMessage
					color="red"
					message={error}
				/>
			</HookedForm.Form>
		</GenericEffectEditorContainer>
	);
}
