import styles from "./EditLocationLinkModal.module.css";
import { LintIgnoredAny } from "@/libs/stp@types";
import { Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "@/libs/stp@radix";
import { RelatedLocationLink } from "../../../LocationLinksEditor";
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
import { UIBasics } from "@/components/(UIBasics)";

const schema = z.object({
	type: zEnumKey(LocationLinkType),
	iconType: zEnumKey(LocationLinkIconType),
	xCoordenate: z.number().min(-1, "Min -1").max(1000, "Max 1000"),
	yCoordenate: z.number().min(-1, "Min -1").max(1000, "Max 1000"),
	size: z.number().min(0, "Min 0").max(1000, "Max 1000"),
	rotation: z.number().min(0, "Min 0").max(360, "Max 360"),
	opacity: z.number().min(0, "Min 0").max(100, "Max 100"),
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
			iconType: locationLink.iconType,
			type: locationLink.type,
			xCoordenate: locationLink.displayData?.x ?? -1,
			yCoordenate: locationLink.displayData?.y ?? -1,
			size: locationLink.displayData?.size ?? 100,
			rotation: locationLink.displayData?.rotation ?? 0,
			opacity: locationLink.displayData?.opacity ?? 100,
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
				size: formData.size,
				rotation: formData.rotation,
				opacity: formData.opacity,
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
							icon: getAlbinaApiFullAddress(
								`/images/atlas/markers/${formData.iconType}?childLocationId=${locationLink.childLocationId}`,
							),
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
					<Dialog.Title textAlign="center">Edit Link</Dialog.Title>
					<HookedForm.Space />
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
										`/images/atlas/markers/${key}?childLocationId=${locationLink.childLocationId}`,
									),
							)}
						/>
						<UIBasics.MultiColumn.Two
							colum1={
								<HookedForm.NumberInput<FormData>
									fieldName="xCoordenate"
									min={-1}
									max={1000}
								/>
							}
							colum2={
								<HookedForm.NumberInput<FormData>
									fieldName="yCoordenate"
									min={-1}
									max={1000}
								/>
							}
						/>
						<HookedForm.NumberInput<FormData>
							fieldName="size"
							min={0}
							max={1000}
						/>
						<HookedForm.NumberInput<FormData>
							fieldName="rotation"
							min={0}
							max={360}
						/>
						<HookedForm.NumberInput<FormData>
							fieldName="opacity"
							min={0}
							max={100}
						/>
						<HookedForm.SubmitButton label="Save" />
					</HookedForm.Form>
					<Dialog.Description />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
