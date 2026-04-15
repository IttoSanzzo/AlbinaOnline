"use client";

import { HookedForm } from "@/libs/stp@forms";
import { LintIgnoredAny } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { revalidateTagByClientSide } from "@/utils/ServerActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { UIBasics } from "@/components/(UIBasics)";

import * as CreateItemForm from "../forms/Items";
import * as CreateMasteryForm from "../forms/Masteries";
import * as CreateSkillForm from "../forms/Skills";
import * as CreateSpellForm from "../forms/Spells";
import * as CreateTraitForm from "../forms/Traits";
import * as CreateRaceForm from "../forms/Races";

function getFormMiscs(type: string): {
	schema: LintIgnoredAny;
	apiRoute: string;
	siteRoute: string;
} {
	switch (type) {
		case "items":
			return {
				schema: CreateItemForm.schema,
				apiRoute: "items",
				siteRoute: "items",
			};
		case "masteries":
			return {
				schema: CreateMasteryForm.schema,
				apiRoute: "masteries",
				siteRoute: "maestrias",
			};
		case "skills":
			return {
				schema: CreateSkillForm.schema,
				apiRoute: "skills",
				siteRoute: "skills",
			};
		case "spells":
			return {
				schema: CreateSpellForm.schema,
				apiRoute: "spells",
				siteRoute: "spells",
			};
		case "traits":
			return {
				schema: CreateTraitForm.schema,
				apiRoute: "traits",
				siteRoute: "tracos",
			};
		case "races":
			return {
				schema: CreateRaceForm.schema,
				apiRoute: "races",
				siteRoute: "racas",
			};
		default:
			return {
				schema: undefined,
				apiRoute: "",
				siteRoute: "",
			};
	}
}
function getCreationForm(
	type: string,
	form: UseFormReturn<LintIgnoredAny, unknown, LintIgnoredAny>,
): ReactNode {
	switch (type) {
		case "items":
			return <CreateItemForm.CreationForm form={form} />;
		case "masteries":
			return <CreateMasteryForm.CreationForm form={form} />;
		case "skills":
			return <CreateSkillForm.CreationForm form={form} />;
		case "spells":
			return <CreateSpellForm.CreationForm form={form} />;
		case "traits":
			return <CreateTraitForm.CreationForm form={form} />;
		case "races":
			return <CreateRaceForm.CreationForm form={form} />;
		default:
			return null;
	}
}

interface CreateFormWrapperProps {
	type: string;
}
export function CreateFormWrapper({ type }: CreateFormWrapperProps) {
	const formMiscs = getFormMiscs(type);
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const form = useForm({
		resolver: zodResolver(formMiscs.schema),
		mode: "onChange",
	});

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Creating...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/${formMiscs.apiRoute}`),
			{
				method: "POST",
				body: JSON.stringify(formData),
				headers: { "Content-Type": "application/json" },
			},
		);
		if (!response.ok) {
			setError(
				`Error while creating - ${response.status} ${
					response.statusText
				} : ${await response.text()}`,
			);
			toast.error("Creation failed", { id: toastId });
			return;
		}
		setError("");
		toast.success("Created", { id: toastId });
		revalidateTagByClientSide(`/${formMiscs.apiRoute}`);
		router.push(
			`/${formMiscs.siteRoute}/${(formData as LintIgnoredAny).slug}/edit`,
		);
	}

	return (
		<UIBasics.Box backgroundColor="darkGray">
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				{getCreationForm(type, form)}
				<HookedForm.SubmitButton label="Create" />
				<HookedForm.SimpleMessage
					message={error}
					color="red"
				/>
			</HookedForm.Form>
		</UIBasics.Box>
	);
}
