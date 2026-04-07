import DynamicGallery from "./subComponents/DynamicGallery";
import StaticGallery from "./subComponents/StaticGallery";

interface GalleryProps {
	url: string;
	isEditable?: boolean;
	hideIfEmpty?: boolean;
	withoutMargin?: boolean;
	useAuth?: boolean;
}
export default async function Gallery({
	url,
	isEditable = false,
	hideIfEmpty = false,
	withoutMargin = false,
	useAuth = false,
}: GalleryProps) {
	if (isEditable)
		return (
			<DynamicGallery
				url={url}
				withoutMargin={withoutMargin}
				useAuth={useAuth}
			/>
		);
	return (
		<StaticGallery
			url={url}
			hideIfEmpty={hideIfEmpty}
			withoutMargin={withoutMargin}
			useAuth={useAuth}
		/>
	);
}
