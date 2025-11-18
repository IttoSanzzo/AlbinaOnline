import { Metadata } from "next";
import CharsPageContent from "./pageContent";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { GenericPageContainer } from "@/components/(Design)";
import { SetNavBarModules } from "@/libs/stp@hooks";
import { routeInfra } from "./(routeInfra)";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Chars",
	icon: getAlbinaApiFullAddress("/favicon/core-page/chars"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/chars"),
	},
	route: "/chars",
});

export default function CharsPageServerShell() {
	return (
		<GenericPageContainer
			title="Todos os Chars"
			icon={getAlbinaApiFullAddress("/favicon/core-page/chars")}
			banner={getAlbinaApiFullAddress("/banner/core-page/chars")}>
			<SetNavBarModules contextMenuButton={routeInfra.PageContextMenu} />
			<CharsPageContent />
		</GenericPageContainer>
	);
}
