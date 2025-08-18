import { GenericEffect } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { toast } from "react-hot-toast";
import { useState } from "react";

const schema = z.object({
	name: z.string().optional(),
	role: z.string(),
	color: z.string().optional(),
	contents: z.string(),
});
type FormData = z.infer<typeof schema>;

const GenericEffectEditorContainer = newStyledElement.div(
	styles.genericEffectEditorContainer
);

interface GenericEffectEditorProps {
	genericEffect: GenericEffect;
}
export function GenericEffectEditor({
	genericEffect,
}: GenericEffectEditorProps) {
	const [error, setError] = useState<string>("");
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: genericEffect.name,
			role: genericEffect.role,
			color: genericEffect.color,
			contents: JSON.stringify(genericEffect.contents, null, 2),
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
	}

	return (
		<GenericEffectEditorContainer>
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<HookedForm.TextInput
					labelBackground="gray"
					fieldName="name"
					label="Name ?"
				/>
				<HookedForm.TextInput
					labelBackground="gray"
					fieldName="role"
					label="Role *"
					placeholder="Primário | Secudário | ..."
				/>
				<HookedForm.TextInput
					labelBackground="gray"
					fieldName="color"
					label="Color ?"
					placeholder="Red | Blue | ..."
				/>
				<HookedForm.TextAreaInput
					labelBackground="gray"
					fieldName="contents"
					label="Contents *"
					height={500}
					placeholder={
						'[\n\t{\n\t\t"type": "Quote | Table",\n\t\t"color": null,\n\t\t"value": "..."\n\t},\n\t{\n\t\t...\n\t}\n]'
					}
				/>

				<HookedForm.SubmitButton
					label="Salvar"
					disabled={!form.formState.isValid || form.formState.isSubmitting}
				/>
				<HookedForm.SimpleMessage
					color="red"
					message={error}
				/>
			</HookedForm.Form>
		</GenericEffectEditorContainer>
	);
}
