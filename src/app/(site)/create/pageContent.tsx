"use client";

import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";
import { CreateFormWrapper } from "./subComponents/CreateFormWrapper";
import { useCurrentUser } from "@/libs/stp@hooks";
import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import { RoleHierarchy } from "@/libs/stp@types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const createTypeProps = [
	{ name: "Item", url: "items", value: "items" },
	{ name: "Maestria", url: "maestrias", value: "masteries" },
	{ name: "Skill", url: "skills", value: "skills" },
	{ name: "Spell", url: "spells", value: "spells" },
	{ name: "Traço", url: "tracos", value: "traits" },
	{ name: "Raça", url: "racas", value: "races" },
];

const schema = z.object({
	createType: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function PageContent() {
	const router = useRouter();
	const { user, loading } = useCurrentUser();
	const form = useForm<FormData>({
		defaultValues: {
			createType: "items",
		},
	});

	useEffect(() => {
		if (!loading && user && RoleHierarchy[user.role] <= RoleHierarchy.Admin)
			router.push("/home");
	}, [loading, user]);

	if (loading || !user || RoleHierarchy[user.role] <= RoleHierarchy.Admin)
		return <LoadingCircle />;

	const watchedCreateType = form.watch().createType;

	return (
		<UIBasics.Box backgroundColor="darkGray">
			<HookedForm.Form form={form}>
				<HookedForm.Select<FormData>
					fieldName="createType"
					label="Type"
					options={createTypeProps.map((createType) => ({
						name: createType.name,
						value: createType.value,
						icon: getAlbinaApiFullAddress(`/favicon/${createType.value}`),
					}))}
				/>
			</HookedForm.Form>
			<CreateFormWrapper type={watchedCreateType} />
		</UIBasics.Box>
	);
}
