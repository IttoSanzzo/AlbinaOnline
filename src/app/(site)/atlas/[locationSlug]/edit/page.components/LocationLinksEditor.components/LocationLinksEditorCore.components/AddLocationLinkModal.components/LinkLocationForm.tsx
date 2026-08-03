import { HookedForm, zEnumKey } from "@/libs/stp@forms";
import {
	Guid,
	loadRelatedLocationLink,
	LocationData,
	SearchEntry,
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

enum ChildOrParent {
	Child,
	Parent,
}

const schema = z.object({
	childOrParent: zEnumKey(ChildOrParent),
	relatedLocationId: z
		.string()
		.refine((value) => Guid.isGuid(value), "Not a valid Guid"),
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

interface LinkLocationFormProps {
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
export function LinkLocationForm({
	locationData,
	openState,
	relatedLocationsState,
	defaultPosition,
}: LinkLocationFormProps) {
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			childOrParent: "Child",
			linkIconType: "Auto",
			linkType: "DirectDescendant",
			relatedLocationId: "",
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
