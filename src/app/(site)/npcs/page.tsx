import { Metadata } from "next";
import NpcsPageContent from "./pageContent";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { GenericPageContainer } from "@/components/(Design)";
import { SetNavBarModules } from "@/libs/stp@hooks";
import { routeInfra } from "./(routeInfra)";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Npcs",
	icon: getAlbinaApiFullAddress("/favicon/core-page/npcs"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/npcs"),
	},
	route: "/npcs",
});

export default async function CharsPageServerShell() {
	return (
		<GenericPageContainer
			title="Todos os Npcs"
			icon={getAlbinaApiFullAddress("/favicon/core-page/npcs")}
			banner={getAlbinaApiFullAddress("/banner/core-page/npcs")}>
			<SetNavBarModules contextMenuButton={routeInfra.PageContextMenu} />
			<NpcsPageContent />
		</GenericPageContainer>
	);
}
