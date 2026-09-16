"use client";

import { StpIcon } from "@/libs/stp@icons";
import styles from "./index.module.css";
import { ExternalConnections } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import { HookedForm } from "@/libs/stp@forms";
import z from "zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useEffect } from "react";

const DDDiceConnectionContainer = newStyledElement.div(
	styles.dDDiceConnectionContainer,
);
const GetKeyButton = newStyledElement.button(styles.getKeyButton);

const schema = z.object({
	key: z.string(),
});

type FormData = z.infer<typeof schema>;

interface DDDiceConnectionProps {
	externalLogins: ExternalConnections | null;
}
export function DDDiceConnection({ externalLogins }: DDDiceConnectionProps) {
	const form = useForm<FormData>({
		defaultValues: {
			key: externalLogins?.dddice?.externalUserId ?? "",
		},
	});

	async function handleSubmit(data: FormData) {
		const toastId = toast.loading("Salvando...");
		const response =
			data.key != ""
				? await authenticatedFetchAsync(
						`/auth/me/external-connections/dddice`,
						{
							method: "PUT",
							body: JSON.stringify({
								key: data.key,
							}),
							headers: { "Content-Type": "application/json" },
						},
					)
				: await authenticatedFetchAsync(
						`/auth/me/external-connections/dddice`,
						{
							method: "DELETE",
						},
					);
		if (!response.ok) {
			toast.error("Erro ao salvar", {
				id: toastId,
			});
			return;
		}
		toast.success("Salvo com sucesso", {
			id: toastId,
		});
		return true;
	}

	return (
		<DDDiceConnectionContainer>
			<GetKeyButton
				onClick={() => {
					window.open(
						"https://dddice.com/account/developer",
						"dddice-api",
						"width=1000,height=800,resizable=yes,scrollbars=yes",
					);
				}}>
				<StpIcon name={"FilePlus"} />
			</GetKeyButton>
			<HookedForm.Form<FormData>
				form={form}
				onSubmit={handleSubmit}
				onChangeAction={handleSubmit}>
				<HookedForm.PasswordInput<FormData> fieldName={"key"} />
			</HookedForm.Form>
		</DDDiceConnectionContainer>
	);
}
