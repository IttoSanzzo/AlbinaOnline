"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { HookedForm, SelectOption, zEnumKey, zSlug } from "@/libs/stp@forms";
import { RaceSubType, RaceType } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { enumToSelectOptions } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { revalidatePathByClientSide } from "@/utils/ServerActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(RaceType, ["Unknown"]),
	subType: zEnumKey(RaceSubType, ["Unknown"]),
});
type FormData = z.infer<typeof schema>;
type FormInputData = z.input<typeof schema>;

export function CreateRacePageContent() {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInputData, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
	});

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
		};
		const toastId = toast.loading("Creating race...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress("/races"),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			setError(
				`Error while creating - ${response.status} ${
					response.statusText
				} : ${await response.text()}`
			);
			toast.error("Creation failed", { id: toastId });
			return;
		}
		setError("");
		toast.success("Created", { id: toastId });
		revalidatePathByClientSide("/racas");
		router.push(`/racas/${formData.slug}/edit`);
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(RaceType, [
		"Unknown",
	]);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(RaceSubType, [
		"Unknown",
	]);

	return (
		<GenericPageContainer
			title=""
			icon={getAlbinaApiFullAddress("/favicon/not-found")}
			banner={getAlbinaApiFullAddress("/banner/not-found")}>
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<HookedForm.TextInput
					fieldName="slug"
					label="Slug"
				/>
				<HookedForm.TextInput
					fieldName="name"
					label="Name"
				/>
				<HookedForm.Select
					fieldName="type"
					placeholder="Select Type"
					label="Type"
					options={typeOptions}
				/>
				<HookedForm.Select
					fieldName="subType"
					placeholder="Select SubType"
					label="SubType"
					options={subTypeOptions}
				/>

				<HookedForm.SubmitButton label="Create" />
				<HookedForm.SimpleMessage
					message={error}
					color="red"
				/>
			</HookedForm.Form>
		</GenericPageContainer>
	);
}
