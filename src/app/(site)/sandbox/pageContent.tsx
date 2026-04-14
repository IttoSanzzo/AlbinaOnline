import { GenericPageContainer } from "@/components/(Design)";
import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import { UIBasics } from "@/components/(UIBasics)";

export default async function SandboxPageContent() {
	return (
		<GenericPageContainer title="">
			<UIBasics.Box backgroundColor="red">
				<LoadingCircle size={200} />
			</UIBasics.Box>
		</GenericPageContainer>
	);
}
