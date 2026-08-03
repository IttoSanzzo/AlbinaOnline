import styles from "./AddLocationLinkModal.module.css";
import {
	Guid,
	loadRelatedLocationLink,
	LocationData,
	SearchEntry,
} from "@/libs/stp@types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Dialog } from "@/libs/stp@radix";
import { RelatedLocationLink } from "../../LocationLinksEditor";
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

enum ChildOrParent {
	Child,
	Parent,
}

const schema = z.object({
	childOrParent: zEnumKey(ChildOrParent),
	relatedLocationId: z
		.string()
		.refine((value) => Guid.isGuid(value), "Not a valid Guid"),
	type: zEnumKey(LocationLinkType),
	iconType: zEnumKey(LocationLinkIconType),
	xCoordenate: z.number().min(-1, "Min -1").max(1000, "Max 1000"),
	yCoordenate: z.number().min(-1, "Min -1").max(1000, "Max 1000"),
});

type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface AddLocationLinkModalProps {
	locationData: LocationData;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
	openState: [boolean, Dispatch<SetStateAction<boolean>>];
	displayTriggerButton?: boolean;
	defaultPosition?: {
		x: number;
		y: number;
	};
}
export function AddLocationLinkModal({
	locationData,
	relatedLocationsState,
	openState,
	displayTriggerButton = true,
	defaultPosition,
}: AddLocationLinkModalProps) {
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			childOrParent: "Child",
			iconType: "Auto",
			type: "DirectDescendant",
			relatedLocationId: "",
			xCoordenate: defaultPosition?.x ?? -1,
			yCoordenate: defaultPosition?.y ?? -1,
		},
		mode: "all",
	});

	useEffect(() => {
		if (!defaultPosition) return;
		form.reset((formData) => ({
			...formData,
			xCoordenate: defaultPosition.x,
			yCoordenate: defaultPosition.y,
		}));
	}, [defaultPosition]);

	async function onSubmit(formData: FormData) {
		const body = {
			parentLocationId:
				formData.childOrParent == "Parent"
					? formData.relatedLocationId
					: locationData.id,
			childLocationId:
				formData.childOrParent == "Child"
					? formData.relatedLocationId
					: locationData.id,
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
			getAlbinaApiFullAddress(`/atlas/location-links`),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) return;
		revalidateTagByClientSide(`/atlas`);
		revalidateTagByClientSide(`/atlas/location-links`);
		const data = await response.json();
		const newLocationLink = await loadRelatedLocationLink(data.id);
		relatedLocationsState[1]((state) => [
			...state,
			{ ...newLocationLink!, isChild: formData.childOrParent == "Child" },
		]);
		openState[1](false);
	}

	return (
		<Dialog.Root open={openState[0]}>
			{displayTriggerButton && (
				<Dialog.Trigger
					className={styles.trigger}
					onClick={(event) => {
						event.preventDefault();
						openState[1](true);
					}}>
					Add Link
				</Dialog.Trigger>
			)}
			<Dialog.Portal>
				<Dialog.Overlay onClick={() => openState[1](false)} />
				<Dialog.Content>
					<Dialog.Title>Add Link</Dialog.Title>
					<HookedForm.Form
						form={form}
						onSubmit={onSubmit}>
						<HookedForm.Select<FormData>
							fieldName="childOrParent"
							options={enumToSelectOptions(ChildOrParent, [], undefined, false)}
						/>
						<HookedForm.AsyncSearchSelect<FormData>
							fieldName="relatedLocationId"
							placeholder={"Location Name"}
							optionGenerator={async (query) => {
								const response = await authenticatedFetchAsync(
									getAlbinaApiFullAddress(`/search/atlas?query=${query}`),
								);
								if (!response.ok) return [];
								const locationMetas: SearchEntry[] = await response.json();
								return locationMetas.map((meta) => ({
									name: meta.title,
									value: meta.id,
									icon: meta.iconUrl,
								}));
							}}
						/>
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
									getAlbinaApiFullAddress(`/images/atlas/markers/${key}`),
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
						<HookedForm.SubmitButton label="Link" />
					</HookedForm.Form>
					<Dialog.Description />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
