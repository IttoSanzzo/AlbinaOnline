import { HookedForm } from "@/libs/stp@forms";
import { Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { CharToastMessage } from "../../../../../CharacterEditableDataDisplays";

const schema = z.object({
	level: z.coerce
		.number()
		.min(-1, "Nível mínimo é -1")
		.max(20, "Nível máximo é 20"),
});
type FormData = z.infer<typeof schema>;

interface LevelSelectorProps {
	characterId: Guid;
	level: number;
}
export function LevelSelector({ characterId, level }: LevelSelectorProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			level: level,
		},
	});

	async function onLevelChange(values: FormData) {
		const body = {
			level: values.level,
		};
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/level`),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			toast.error(CharToastMessage.error, { id: toastId });
			return false;
		}
		toast.success(CharToastMessage.success, { id: toastId });
		return true;
	}

	return (
		<HookedForm.Form
			form={form}
			onChangeAction={onLevelChange}>
			<HookedForm.NumberInputInline
				fieldName="level"
				min={-1}
				max={20}
				color="yellow"
			/>
		</HookedForm.Form>
	);
}
