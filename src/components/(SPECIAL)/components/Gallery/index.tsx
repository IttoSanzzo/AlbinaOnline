import EditableGallery from "./subComponents/EditableGallery";
import StaticGallery from "./subComponents/StaticGallery";

interface GalleryProps {
	url: string;
	isEditable?: boolean;
	hideIfEmpty?: boolean;
	withoutMargin?: boolean;
}
export default async function Gallery({
	url,
	isEditable = false,
	hideIfEmpty = false,
	withoutMargin = false,
}: GalleryProps) {
	if (isEditable)
		return (
			<EditableGallery
				url={url}
				withoutMargin={withoutMargin}
			/>
		);
	return (
		<StaticGallery
			url={url}
			hideIfEmpty={hideIfEmpty}
			withoutMargin={withoutMargin}
		/>
	);
}
