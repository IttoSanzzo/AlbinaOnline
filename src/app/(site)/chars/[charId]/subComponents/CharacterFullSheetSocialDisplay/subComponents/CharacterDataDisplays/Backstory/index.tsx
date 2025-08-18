import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import z from "zod";
import { UIBasics } from "@/components/(UIBasics)";

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
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			backstory: characterBackstory,
		},
	});

	return (
		<HookedForm.Form form={form}>
			<UIBasics.Box
				backgroundColor="gray"
				withoutBorder
				withoutMargin>
				<HookedForm.TextAreaInput
					fieldName="backstory"
					label="História"
					labelBackground="gray"
					height={300}
					disabled
				/>
			</UIBasics.Box>
		</HookedForm.Form>
	);
}
