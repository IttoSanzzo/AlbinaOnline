import { HookedForm } from "@/libs/stp@forms";
import { CampaignInvite } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const schema = z.object({
	maxUses: z.number().min(1, "Min 1").max(20, "Max 20"),
});

type FormData = z.infer<typeof schema>;

interface CreateNewInviteFormProps {
	campaignSlug: string;
	setInvites: Dispatch<SetStateAction<CampaignInvite[]>>;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export function CreateNewInviteForm({
	campaignSlug,
	setInvites,
	setIsOpen,
}: CreateNewInviteFormProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			maxUses: 1,
		},
	});

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Criando convite...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaignSlug}/invites`,
			{
				method: "Post",
				body: JSON.stringify(formData),
				headers: { "Content-Type": "application/json" },
			},
		);
		if (!response.ok) {
			toast.error("Falha ao criar convite", { id: toastId });
			return;
		}
		toast.success("Convite criado", { id: toastId });
		form.reset();
		setIsOpen(false);
		const newInvite = await response.json();
		setInvites((state) => [...state, newInvite]);
	}

	const maxUses = form.watch().maxUses;

	return (
		<HookedForm.Form<FormData>
			form={form}
			onSubmit={onSubmit}>
			<HookedForm.Space />
			<HookedForm.NumberInput<FormData>
				fieldName="maxUses"
				min={1}
				max={20}
			/>
			<HookedForm.Space />
			<HookedForm.SubmitButton
				label="Criar"
				disabled={maxUses < 1 || form.watch().maxUses > 20}
			/>
		</HookedForm.Form>
	);
}
