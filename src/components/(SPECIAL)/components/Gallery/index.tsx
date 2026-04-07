import EditableGallery from "./subComponents/EditableGallery";
import StaticGallery from "./subComponents/StaticGallery";

interface GalleryProps {
	url: string;
	isEditable?: boolean;
}
export default async function Gallery({
	url,
	isEditable = false,
}: GalleryProps) {
	if (isEditable) return <EditableGallery url={url} />;
	return <StaticGallery url={url} />;
}
