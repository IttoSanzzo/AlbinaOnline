import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageContent from "./pageContent";
import { GenericPageContainer } from "@/components/(Design)";

export const metadata: Metadata = assembleMetadata({
	title: "Create",
	icon: getAlbinaApiFullAddress("/favicon/create"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/create"),
	},
	route: "/create",
});

interface CreatePageServerShellProps {}
export default function CreatePageServerShell({}: CreatePageServerShellProps) {
	return (
		<GenericPageContainer
			title="Create"
			icon={getAlbinaApiFullAddress("/favicon/create")}
			banner={getAlbinaApiFullAddress("/banner/create")}>
			<PageContent />
		</GenericPageContainer>
	);
}
