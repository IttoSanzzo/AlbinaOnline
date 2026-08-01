import styles from "./EditLocationLinkModal.module.css";
import { LintIgnoredAny } from "@/libs/stp@types";
import { Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "@/libs/stp@radix";
import { RelatedLocationLink } from "./LocationLinksEditor.sub";
import { HookedForm, zEnumKey } from "@/libs/stp@forms";
import { enumToSelectOptions } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
	LocationLinkIconType,
	LocationLinkType,
} from "@/libs/stp@types/dataTypes/locationLink";
import { revalidateTagByClientSide } from "@/utils/ServerActions";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { StpIcon } from "@/libs/stp@icons";
import toast from "react-hot-toast";

const schema = z.object({
	type: zEnumKey(LocationLinkType),
	iconType: zEnumKey(LocationLinkIconType),
	xCoordenate: z.number().min(-1, "Min -1").max(1000, "Max 1000"),
	yCoordenate: z.number().min(-1, "Min -1").max(1000, "Max 1000"),
});

type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface EditLocationLinkModalProps {
	locationLink: RelatedLocationLink;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
}
export function EditLocationLinkModal({
	locationLink,
	relatedLocationsState,
}: EditLocationLinkModalProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			iconType: "Auto",
			type: "DirectDescendant",
			xCoordenate: -1,
			yCoordenate: -1,
		},
		mode: "all",
	});

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Saving...");
		const body = {
			type: formData.type,
			iconType: formData.iconType,
			displayData: undefined as unknown,
		};
		if (formData.xCoordenate != -1 && formData.yCoordenate != -1)
			body.displayData = {
				x: formData.xCoordenate,
				y: formData.yCoordenate,
				rotation: 0,
				opacity: 100,
			};

		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/atlas/location-links/${locationLink.id}`),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			toast.error("Error", { id: toastId });
			return;
		}
		toast.success("Saved", { id: toastId });
		revalidateTagByClientSide(`/atlas`);
		revalidateTagByClientSide(`/atlas/location-links`);
		relatedLocationsState[1]((state) => [
			...state.map((link) =>
				link.id != locationLink.id
					? link
					: {
							...link,
							type: formData.type,
							iconType: formData.iconType,
							displayData: body.displayData as LintIgnoredAny,
						},
			),
		]);
		setIsOpen(false);
		return true;
	}

	return (
		<Dialog.Root open={isOpen}>
			<DialogTrigger
				className={styles.trigger}
				onClick={() => setIsOpen(true)}>
				<StpIcon name="Pencil" />
			</DialogTrigger>
			<Dialog.Portal>
				<Dialog.Overlay onClick={() => setIsOpen(false)} />
				<Dialog.Content>
					<Dialog.Title>Edit Link</Dialog.Title>
					<HookedForm.Form
						form={form}
						onSubmit={onSubmit}>
						<HookedForm.Select<FormData>
							fieldName="type"
							options={enumToSelectOptions(
								LocationLinkType,
								[],
								undefined,
								false,
							)}
						/>
						<HookedForm.Select<FormData>
							fieldName="iconType"
							options={enumToSelectOptions(
								LocationLinkIconType,
								[],
								undefined,
								false,
								(key: string) =>
									getAlbinaApiFullAddress(
										`/images/target/atlas/markers/${key}`,
									),
							)}
						/>
						<HookedForm.NumberInput<FormData>
							fieldName="xCoordenate"
							min={-1}
							max={1000}
						/>
						<HookedForm.NumberInput<FormData>
							fieldName="yCoordenate"
							min={-1}
							max={1000}
						/>
						<HookedForm.SubmitButton label="Save" />
					</HookedForm.Form>
					<Dialog.Description />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
