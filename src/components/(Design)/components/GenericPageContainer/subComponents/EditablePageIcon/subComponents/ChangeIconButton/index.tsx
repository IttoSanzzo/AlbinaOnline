"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Dialog } from "@/libs/stp@radix";
import { StpIcon } from "@/libs/stp@icons";
import { DialogDescription } from "@radix-ui/react-dialog";
import { HookedForm } from "@/libs/stp@forms";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";

const ChangeIconButtonContainer = newStyledElement.div(
	styles.changeIconButtonContainer
);
const ChangeIconButtonTrigger = newStyledElement.button(
	styles.changeIconButtonTrigger
);

const schema = z.object({
	image: z.instanceof(File),
});

type FormData = z.infer<typeof schema>;

interface ChangeIconButtonProps {
	iconSrc: string;
	setIcon: Dispatch<SetStateAction<string>>;
	route: string;
}
export function ChangeIconButton({
	iconSrc,
	setIcon,
	route,
}: ChangeIconButtonProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const {
		control,
		handleSubmit,
		formState: { isValid, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(data: FormData) {
		const bodyData = new FormData();
		bodyData.append("file", data.image);

		const response = await authenticatedFetchAsync(route, {
			method: "PUT",
			body: bodyData,
		});
		if (!response.ok) {
			setError("Salvamento falhou");
			return;
		}
		setOpen(false);
		setIcon(`${iconSrc}?t=${Date.now()}`);
	}

	return (
		<ChangeIconButtonContainer>
			<Dialog.Root
				open={open}
				onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					<ChangeIconButtonTrigger>
						{StpIcon({ name: "PencilSimple", color: "yellow", style: "bold" })}
					</ChangeIconButtonTrigger>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content>
							<Dialog.Title textAlign="center">Novo Icone</Dialog.Title>
							<DialogDescription />
							<HookedForm.Form onSubmit={handleSubmit(onSubmit)}>
								<HookedForm.ImageInput
									control={control}
									label="Insira nova imagem"
									fieldName="image"
									minWidth={256}
									minHeight={256}
									proportion={1}
									maxSize={4_194_304}
									maxWidth={1440}
									maxHeight={1440}
								/>
								<HookedForm.SubmitButton
									disabled={!isValid || isSubmitting}
									label="Salvar"
								/>
								{error && (
									<HookedForm.SimpleMessage
										color="red"
										message={error}
									/>
								)}
							</HookedForm.Form>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ChangeIconButtonContainer>
	);
}
