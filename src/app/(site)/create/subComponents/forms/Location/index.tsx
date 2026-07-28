"use client";

import {
	HookedForm,
	SelectOption,
	toSlug,
	zEnumKey,
	zSlug,
} from "@/libs/stp@forms";
import {
	LintIgnoredAny,
	LocationSubType,
	LocationType,
	WorldPlane,
} from "@/libs/stp@types";
import { enumToSelectOptions } from "@/utils/Data";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(LocationType, ["Unknown"]),
	subType: zEnumKey(LocationSubType, ["Unknown"]),
	worldPlane: zEnumKey(WorldPlane, ["Unknown"]),
});
type FormData = z.infer<typeof schema>;

interface CreationFormProps {
	form: UseFormReturn<LintIgnoredAny, unknown, LintIgnoredAny>;
}
export function CreationForm({ form }: CreationFormProps) {
	void form;
	const typeOptions = enumToSelectOptions(
		LocationType,
		["Unknown"],
		undefined,
		false,
	);
	const worldPlaneOptions = enumToSelectOptions(
		WorldPlane,
		["Unknown"],
		undefined,
		false,
	);

	let subTypesFromThisType: string[] = [];
	switch (form.watch().type) {
		case "World":
			subTypesFromThisType = ["Axis"];
			break;
		case "Region":
			subTypesFromThisType = [
				"Continent",
				"Archipelago",
				"Kingdom",
				"Province",
			];
			break;
		case "Nature":
			subTypesFromThisType = [
				"Island",
				"Forest",
				"WhiteForest",
				"Desert",
				"Swamp",
				"Plains",
				"Mountain",
				"GreenMountain",
				"WhiteMountain",
				"BrownMountain",
				"Volcano",
				"Cave",
				"River",
				"Lake",
			];
			break;
		case "Settlement":
			subTypesFromThisType = ["Metropoly", "City", "Village", "Farm"];
			break;
		case "District":
			subTypesFromThisType = [
				"Noble",
				"Slum",
				"Merchant",
				"Military",
				"Farmland",
			];
			break;
		case "Structure":
			subTypesFromThisType = [
				"Castle",
				"Fortress",
				"Outpost",
				"Guild",
				"Temple",
				"Store",
				"Shop",
				"Bank",
				"Library",
				"Academy",
				"Inn",
				"Dungeon",
				"Arena",
				"Prison",
				"Waystation",
			];
			break;
		case "Interior":
			subTypesFromThisType = ["Floor", "Hall", "Room"];
			break;
		case "Landmark":
			subTypesFromThisType = [
				"Monument",
				"Ruins",
				"Bridge",
				"Mine",
				"Harbor",
				"Portal",
				"PointOfInterest",
			];
			break;
		case "Plane":
			subTypesFromThisType = ["Pocket", "Fixed"];
			break;
		default:
			break;
	}
	const subTypeOptions: SelectOption[] = subTypesFromThisType.map(
		(subType) => ({ value: subType, name: subType }),
	);

	return (
		<>
			<HookedForm.TextInput<FormData>
				fieldName="name"
				label="Name"
				onChange={(event) => {
					form.setValue("slug", toSlug(event.target.value));
				}}
				autoFocus={true}
			/>
			<HookedForm.TextInput<FormData>
				fieldName="slug"
				label="Slug"
			/>
			<HookedForm.Select<FormData>
				fieldName="worldPlane"
				placeholder="Select WorldPlane"
				label="World Plane"
				options={worldPlaneOptions}
			/>
			<HookedForm.Select<FormData>
				fieldName="type"
				placeholder="Select Type"
				label="Type"
				options={typeOptions}
			/>
			<HookedForm.Select<FormData>
				fieldName="subType"
				placeholder="Select SubType"
				label="SubType"
				options={subTypeOptions}
			/>
		</>
	);
}
