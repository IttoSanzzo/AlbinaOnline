import { HookedForm, zEnumKey, zSlug } from "@/libs/stp@forms";
import {
	loadRelatedLocationLink,
	LocationData,
	LocationSubType,
	LocationType,
	WorldPlane,
} from "@/libs/stp@types";
import {
	LocationLinkIconType,
	LocationLinkType,
} from "@/libs/stp@types/dataTypes/locationLink";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { revalidateTagByClientSide } from "@/utils/ServerActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { RelatedLocationLink } from "../../../LocationLinksEditor";
import { enumToSelectOptions } from "@/utils/Data";
import { UIBasics } from "@/components/(UIBasics)";
import { CreationForm } from "@/app/(site)/create/subComponents/forms/Location";
import toast from "react-hot-toast";

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(LocationType, ["Unknown"]),
	subType: zEnumKey(LocationSubType, ["Unknown"]),
	worldPlane: zEnumKey(WorldPlane, ["Unknown"]),

	linkType: zEnumKey(LocationLinkType),
	linkIconType: zEnumKey(LocationLinkIconType),
	xCoordenate: z.number().min(-1, "Min -1").max(1000, "Max 1000"),
	yCoordenate: z.number().min(-1, "Min -1").max(1000, "Max 1000"),
	size: z.number().min(0, "Min 0").max(1000, "Max 1000"),
	rotation: z.number().min(0, "Min 0").max(360, "Max 360"),
	opacity: z.number().min(0, "Min 0").max(100, "Max 100"),
});

type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface CreateAndLinkLocationFormProps {
	locationData: LocationData;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
	openState: [boolean, Dispatch<SetStateAction<boolean>>];
	defaultPosition?: {
		x: number;
		y: number;
	};
}
export function CreateAndLinkLocationForm({
	locationData,
	openState,
	relatedLocationsState,
	defaultPosition,
}: CreateAndLinkLocationFormProps) {
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			slug: "",
			name: "",
			type: "",
			subType: "",
			worldPlane: "Orvanis",

			linkType: "DirectDescendant",
			linkIconType: "Auto",
			xCoordenate: defaultPosition?.x ?? -1,
			yCoordenate: defaultPosition?.y ?? -1,
			size: 100,
			rotation: 0,
			opacity: 100,
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

	async function postLocation(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			worldPlane: formData.worldPlane,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/atlas`),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) return null;
		revalidateTagByClientSide("/atlas");
		const data: LocationData = await response.json();
		return data;
	}

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Creating new location...");
		const newLocation = await postLocation(formData);
		if (newLocation == null) {
			toast.error("Error while creating new location!", { id: toastId });
			return;
		}
		toast.loading("Saving...", { id: toastId });

		const body = {
			parentLocationId: locationData.id,
			childLocationId: newLocation.id,
			type: formData.linkType,
			iconType: formData.linkIconType,
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
			getAlbinaApiFullAddress(`/atlas/location-links`),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			toast.loading("Error while creating link!", { id: toastId });
			return;
		}
		toast.success("Link Saved", { id: toastId });
		revalidateTagByClientSide(`/atlas`);
		revalidateTagByClientSide(`/atlas/location-links`);
		const data = await response.json();
		const newLocationLink = await loadRelatedLocationLink(data.id);
		relatedLocationsState[1]((state) => [
			...state,
			{ ...newLocationLink!, isChild: true },
		]);
		openState[1](false);
	}

	return (
		<HookedForm.Form
			form={form}
			onSubmit={onSubmit}>
			<CreationForm form={form} />

			<HookedForm.Space height={1} />
			<UIBasics.Divisor color="gray" />
			<HookedForm.Space height={1} />

			<HookedForm.Select<FormData>
				fieldName="linkType"
				options={enumToSelectOptions(LocationLinkType, [], undefined, false)}
			/>

			<HookedForm.Select<FormData>
				fieldName="linkIconType"
				options={enumToSelectOptions(
					LocationLinkIconType,
					[],
					undefined,
					false,
					(key: string) =>
						getAlbinaApiFullAddress(
							`/images/atlas/markers/${key}?childLocationId=${locationData.id}`,
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
			<HookedForm.SubmitButton label="Link" />
		</HookedForm.Form>
	);
}
