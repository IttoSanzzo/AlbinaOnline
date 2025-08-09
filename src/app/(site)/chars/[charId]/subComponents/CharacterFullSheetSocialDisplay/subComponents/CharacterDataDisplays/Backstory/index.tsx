import { NotionBox } from "@/components/(NotionBased)";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import z from "zod";

const schema = z.object({
	backstory: z.string().max(5000, "Máximo de 5000 caracteres"),
});
type FormData = z.infer<typeof schema>;

interface CharacterBackstoryDisplayProps {
	characterBackstory: string;
}
export function CharacterBackstoryDisplay({
	characterBackstory,
}: CharacterBackstoryDisplayProps) {
	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			backstory: characterBackstory,
		},
	});

	return (
		<HookedForm.Form>
			<HookedForm.WatchedAction
				watch={watch}
				isValid={isValid}
				debounce={3000}
				action={async () => false}
			/>
			<NotionBox
				backgroundColor="gray"
				withoutBorder
				withoutMargin>
				<HookedForm.TextAreaInput
					control={control}
					fieldName="backstory"
					label="História"
					labelBackground="gray"
					height={300}
					disabled
				/>
			</NotionBox>
		</HookedForm.Form>
	);
}
