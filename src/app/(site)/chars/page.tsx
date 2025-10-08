import { Metadata } from "next";
import CharsPageContent from "./pageContent";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { GenericPageContainer } from "@/components/(Design)";
import { SetNavBarModules } from "@/libs/stp@hooks";
import { routeInfra } from "./(routeInfra)";

export const metadata: Metadata = {
	title: "Chars",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/chars"),
	},
};

export default function CharsPageServerShell() {
	return (
		<GenericPageContainer
			title="Todos os Chars"
			icon={getAlbinaApiAddress("/favicon/core-page/chars")}
			banner={getAlbinaApiAddress("/banner/core-page/chars")}>
			<SetNavBarModules contextMenuButton={routeInfra.PageContextMenu} />
			<CharsPageContent />
		</GenericPageContainer>
	);
}
