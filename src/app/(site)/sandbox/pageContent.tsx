import { GenericPageContainer } from "@/components/(Design)";
import Gallery from "@/components/(SPECIAL)/components/Gallery";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

export default async function SandboxPageContent() {
	return (
		<GenericPageContainer title="">
			<UIBasics.Box
				backgroundColor="red"
				style={{}}>
				<Gallery
					url={getAlbinaApiFullAddress(`/images/items/kurehime`)}
					// isEditable
				/>
			</UIBasics.Box>
		</GenericPageContainer>
	);
}
