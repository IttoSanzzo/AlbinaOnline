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
import { zodResolver } from "@hookform/resolvers/zod";

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
	const types = createTypeProps.map((type) => type.value);
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			createType: types[0],
		},
		mode: "onChange",
	});
	const watchedCreateType = form.watch().createType;

	useEffect(() => {
		setTimeout(() => {
			const lastType = localStorage.getItem("CreateCatalogEntryLastType");
			if (lastType && lastType != watchedCreateType && types.includes(lastType))
				form.setValue("createType", lastType);
		}, 0);
	}, []);

	useEffect(() => {
		if (!loading && user && RoleHierarchy[user.role] <= RoleHierarchy.Admin)
			router.push("/home");
	}, [loading, user]);

	if (loading || !user || RoleHierarchy[user.role] <= RoleHierarchy.Admin)
		return <LoadingCircle />;

	return (
		<UIBasics.Box backgroundColor="darkGray">
			<HookedForm.Form
				form={form}
				actionDebounceMs={0}
				onChangeAction={(data: FormData) => {
					if (data.createType && types.includes(data.createType))
						localStorage.setItem("CreateCatalogEntryLastType", data.createType);
				}}>
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
