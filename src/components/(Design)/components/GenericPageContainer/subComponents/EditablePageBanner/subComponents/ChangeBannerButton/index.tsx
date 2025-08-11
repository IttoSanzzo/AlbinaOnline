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

const ChangeBannerButtonContainer = newStyledElement.div(
	styles.changeBannerButtonContainer
);
const ChangeBannerButtonTrigger = newStyledElement.button(
	styles.changeBannerButtonTrigger
);

const schema = z.object({
	image: z.instanceof(File),
});

type FormData = z.infer<typeof schema>;

interface ChangeBannerButtonProps {
	bannerSrc: string;
	setBanner: Dispatch<SetStateAction<string>>;
	route: string;
}
export function ChangeBannerButton({
	bannerSrc,
	setBanner,
	route,
}: ChangeBannerButtonProps) {
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
		setBanner(`${bannerSrc}?t=${Date.now()}`);
	}

	return (
		<ChangeBannerButtonContainer>
			<Dialog.Root
				open={open}
				onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					<ChangeBannerButtonTrigger>
						{StpIcon({ name: "PencilSimple", color: "yellow", style: "bold" })}
					</ChangeBannerButtonTrigger>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content>
							<Dialog.Title textAlign="center">Novo Banner</Dialog.Title>
							<DialogDescription />
							<HookedForm.Form onSubmit={handleSubmit(onSubmit)}>
								<HookedForm.ImageInput
									control={control}
									label="Insira nova imagem"
									fieldName="image"
									minWidth={735}
									minHeight={280}
									maxSize={4_194_304}
									maxWidth={4000}
									maxHeight={2000}
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
		</ChangeBannerButtonContainer>
	);
}
