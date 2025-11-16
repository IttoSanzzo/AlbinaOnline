import { HookedForm } from "@/libs/stp@forms";
import { GenericEffect } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { revalidatePathByClientSide } from "@/utils/ServerActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const schema = z.object({
	role: z.string().min(1, "Must be at leat 1 character long"),
});
type FormData = z.infer<typeof schema>;

interface ChangeEffectRoleProps {
	genericEffect: GenericEffect;
	pathname: string;
	revalidatePath?: string;
}
export function ChangeEffectRole({
	genericEffect,
	pathname,
	revalidatePath,
}: ChangeEffectRoleProps) {
	const [error, setError] = useState<string>("");
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			role: genericEffect.role,
		},
	});

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Saving new role...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(
				`/effect-links/${genericEffect.effectLinkId}/role`
			),
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
		toast.success("New role saved", { id: toastId });
		revalidatePathByClientSide(pathname);
		if (revalidatePath) revalidatePathByClientSide(revalidatePath);
	}

	return (
		<HookedForm.Form
			form={form}
			onSubmit={onSubmit}>
			<HookedForm.TextInput
				fieldName="role"
				labelBackground="gray"
				label="Role"
			/>
			<HookedForm.SubmitButton label="Change Role" />
			<HookedForm.SimpleMessage
				color="red"
				message={error}
			/>
		</HookedForm.Form>
	);
}
