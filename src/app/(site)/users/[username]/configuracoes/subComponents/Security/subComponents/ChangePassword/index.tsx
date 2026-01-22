"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { HookedForm } from "@/libs/stp@forms";
import { resetAllStores } from "@/libs/stp@hooks";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const schema = z
	.object({
		oldPassword: z.string().min(1, "Senha anterior necessária."),
		newPassword1: z
			.string()
			.min(8, { message: "Senha deve conter ao menos 8 caracteres." })
			.refine((val) => /[a-zA-Z]/.test(val), {
				message: "Senha deve conter ao menos uma letra.",
			})
			.refine((val) => /\d/.test(val), {
				message: "Senha deve conter ao menos 1 número.",
			}),
		newPassword2: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.newPassword1 !== data.newPassword2) {
			ctx.addIssue({
				path: ["newPassword2"],
				message: "As senhas não coincidem",
				code: z.ZodIssueCode.custom,
			});
		}
	});
type FormData = z.infer<typeof schema>;

export function ChangePassword() {
	const router = useRouter();

	const form = useForm<FormData>({
		defaultValues: {
			newPassword1: "",
			newPassword2: "",
			oldPassword: "",
		},
		resolver: zodResolver(schema),
		mode: "all",
		shouldFocusError: true,
		reValidateMode: "onChange",
	});
	const { formState } = form;

	return (
		<UIBasics.Box backgroundColor="darkGray">
			<UIBasics.Header
				headerType="h3"
				textColor="gray"
				children={"Alterar senha"}
			/>
			<HookedForm.Form
				form={form}
				onSubmit={async (data) => {
					console.log("AAA");
					if (
						formState.errors.oldPassword ||
						formState.errors.newPassword1 ||
						formState.errors.newPassword2
					)
						return;
					const toastId = toast.loading("Salvando...");
					const response = await authenticatedFetchAsync(
						getAlbinaApiFullAddress("/auth/me/change-password"),
						{
							method: "POST",
							body: JSON.stringify({
								oldPassword: data.oldPassword,
								newPassword: data.newPassword1,
							}),
							headers: {
								"Content-Type": "application/json",
							},
						},
					);
					if (!response.ok) {
						toast.error("Alteração falhou", { id: toastId });
						return;
					}
					toast.success("Salvo", { id: toastId });
					const logoutResponse = await fetch(
						`${getAlbinaApiFullAddress()}/auth/logout`,
						{
							method: "POST",
							credentials: "include",
						},
					);
					if (logoutResponse.status == 200) {
						resetAllStores();
						router.push("/login");
					} else console.error("Something went bad with logout procedure.");
				}}>
				<HookedForm.PasswordInput<FormData>
					fieldName="oldPassword"
					label="Senha Atual *"
					labelBackground="gray"
				/>
				<HookedForm.PasswordInput<FormData>
					fieldName="newPassword1"
					label="Nova Senha *"
					labelBackground="gray"
				/>
				<HookedForm.PasswordInput<FormData>
					fieldName="newPassword2"
					label="Nova Senha Novamente *"
					labelBackground="gray"
				/>
				<HookedForm.SubmitButton
					label="Salvar"
					disabled={false}
				/>
			</HookedForm.Form>
		</UIBasics.Box>
	);
}
