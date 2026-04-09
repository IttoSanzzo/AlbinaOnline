import { GenericPageContainer } from "@/components/(Design)";
import StaticGallery from "@/components/(SPECIAL)/components/Gallery/StaticGallery";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

export default async function SandboxPageContent() {
	return (
		<GenericPageContainer title="">
			<UIBasics.Box
				backgroundColor="red"
				style={{}}>
				<StaticGallery
					url={getAlbinaApiFullAddress(`/images/items/kurehime`)}
					// isEditable
				/>
			</UIBasics.Box>
		</GenericPageContainer>
	);
}
