import { Dispatch, SetStateAction } from "react";
import { RelatedLocationLink } from "../../LocationLinksEditor";
import { UIBasics } from "@/components/(UIBasics)";
import { LocationData } from "@/libs/stp@types";
import { ChangeLocationMapImage } from "./LocationMapEditor.components/ChangeLocationMapImage";
import { EditableLocationMapView } from "./LocationMapEditor.components/EditableLocationMapView";

interface LocationMapEditorProps {
	locationData: LocationData;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
}
export function LocationMapEditor({
	locationData,
	relatedLocationsState,
}: LocationMapEditorProps) {
	return (
		<UIBasics.Box
			withoutBorder
			backgroundColor="gray">
			<EditableLocationMapView
				locationData={locationData}
				relatedLocationsState={relatedLocationsState}
			/>
			<UIBasics.EmptyLine />
			<ChangeLocationMapImage locationData={locationData} />
		</UIBasics.Box>
	);
}
