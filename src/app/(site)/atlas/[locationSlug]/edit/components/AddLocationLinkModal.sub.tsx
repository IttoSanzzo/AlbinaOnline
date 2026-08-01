import { Guid, LocationData } from "@/libs/stp@types";
import { Dispatch, SetStateAction } from "react";
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
}
export function AddLocationLinkModal({
	locationData,
	openState,
}: AddLocationLinkModalProps) {
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			childOrParent: "Child",
			iconType: "Auto",
			type: "DirectDescendant",
			relatedLocationId: "",
			xCoordenate: -1,
			yCoordenate: -1,
		},
		mode: "all",
	});

	async function onSubmit(data: FormData) {
		const body = {
			parentLocationId:
				data.childOrParent == "Parent"
					? data.relatedLocationId
					: locationData.id,
			childLocationId:
				data.childOrParent == "Child"
					? data.relatedLocationId
					: locationData.id,
			type: data.type,
			iconType: data.iconType,
			displayData: undefined as unknown,
		};
		if (data.xCoordenate != -1 && data.yCoordenate != -1)
			body.displayData = {
				x: data.xCoordenate,
				y: data.yCoordenate,
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
		openState[1](false);
	}

	return (
		<Dialog.Root open={openState[0]}>
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
						<HookedForm.TextInput<FormData>
							fieldName="relatedLocationId"
							placeholder={Guid.Empty}
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
						<HookedForm.SubmitButton label="Link" />
					</HookedForm.Form>
					<Dialog.Description />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
