import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import z from "zod";
import { CharacterProfile } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { UIBasics } from "@/components/(UIBasics)";

const TextAreasContainer = newStyledElement.div(styles.textAreasContainer);

const schema = z.object({
	age: z.coerce.number().min(0, "Mínimo de 0 anos"),
	stature: z.coerce.number().min(0, "Mínimo de 0 centímetros"),
	weight: z.coerce.number().min(0, "Mínimo de 0 Kgs"),
	appearanceDescription: z.string().max(1000, "Máximo de 1000 caracteres"),
	personalityTraces: z.string().max(1000, "Máximo de 1000 caracteres"),
	ideals: z.string().max(1000, "Máximo de 1000 caracteres"),
	bonds: z.string().max(1000, "Máximo de 1000 caracteres"),
	summary: z.string().max(1000, "Máximo de 1000 caracteres"),
	backgroundHistory: z.string().max(1000, "Máximo de 1000 caracteres"),
});
type FormData = z.infer<typeof schema>;

interface CharacterProfileDisplayProps {
	characterProfile: CharacterProfile;
}
export function CharacterProfileDisplay({
	characterProfile,
}: CharacterProfileDisplayProps) {
	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: characterProfile,
	});

	return (
		<HookedForm.Form>
			<HookedForm.WatchedAction
				watch={watch}
				isValid={isValid}
				debounce={3000}
				action={async () => false}
			/>
			<UIBasics.Box
				backgroundColor="gray"
				withoutBorder
				withoutMargin>
				<UIBasics.Table
					direction="column"
					columnBackgroundColors={["darkGray", undefined, "darkGray"]}
					tableData={{
						tableLanes: [
							[
								<UIBasics.Text textColor="gray">Idade</UIBasics.Text>,
								<UIBasics.Text
									display="block"
									textAlign="center"
									children={characterProfile.age.toString()}
								/>,
								<UIBasics.Text
									display="block"
									textAlign="center"
									textColor="gray">
									Anos
								</UIBasics.Text>,
							],
							[
								<UIBasics.Text textColor="gray">Altura</UIBasics.Text>,
								<UIBasics.Text
									display="block"
									textAlign="center"
									children={characterProfile.stature.toString()}
								/>,
								<UIBasics.Text
									display="block"
									textAlign="center"
									textColor="gray">
									Centímetros
								</UIBasics.Text>,
							],
							[
								<UIBasics.Text textColor="gray">Peso</UIBasics.Text>,
								<UIBasics.Text
									display="block"
									textAlign="center"
									children={characterProfile.weight.toString()}
								/>,
								<UIBasics.Text
									display="block"
									textAlign="center"
									textColor="gray">
									Kgs
								</UIBasics.Text>,
							],
						],
					}}
				/>
				<HookedForm.Space height={5} />
				<UIBasics.MultiColumn.Two
					colum1={
						<TextAreasContainer>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="personalityTraces"
								label="Traços de Personalidade"
								labelBackground="gray"
								disabled
							/>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="ideals"
								label="Ideais"
								labelBackground="gray"
								disabled
							/>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="bonds"
								label="Vínculos"
								labelBackground="gray"
								disabled
							/>
						</TextAreasContainer>
					}
					colum2={
						<TextAreasContainer>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="summary"
								label="Sumário"
								labelBackground="gray"
								disabled
							/>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="appearanceDescription"
								label="Aparência"
								labelBackground="gray"
								disabled
							/>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="backgroundHistory"
								label="Background"
								labelBackground="gray"
								disabled
							/>
						</TextAreasContainer>
					}
				/>
				<HookedForm.Space height={5} />
				<HookedForm.Separator />
			</UIBasics.Box>
		</HookedForm.Form>
	);
}
