import { Metadata } from "next";
import CharsPageContent from "./pageContent";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { GenericPageContainer } from "@/components/(Design)";
import { SetNavBarModules } from "@/libs/stp@hooks";
import { routeInfra } from "./(routeInfra)";

export const metadata: Metadata = {
	title: "Chars",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/chars"),
	},
};

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
