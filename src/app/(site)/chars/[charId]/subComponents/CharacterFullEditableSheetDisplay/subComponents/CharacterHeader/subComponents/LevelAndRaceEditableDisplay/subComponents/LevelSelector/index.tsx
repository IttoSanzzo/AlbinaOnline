import { HookedForm } from "@/libs/stp@forms";
import { Guid } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
	level: z.number().min(-1, "Nível mínimo é -1").max(20, "Nível máximo é 20"),
});
type FormData = z.infer<typeof schema>;

interface LevelSelectorProps {
	characterId: Guid;
	level: number;
}
export function LevelSelector({ characterId, level }: LevelSelectorProps) {
	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			level: level,
		},
	});

	async function onLevelChange(values: FormData) {
		const body = {
			level: values.level,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/level`),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return response.ok;
	}

	return (
		<HookedForm.Form>
			<HookedForm.WatchedAction
				watch={watch}
				isValid={isValid}
				action={onLevelChange}
			/>
			<HookedForm.NumberInputInline
				control={control}
				fieldName="level"
				min={-1}
				max={20}
				color="yellow"
			/>
		</HookedForm.Form>
	);
}
