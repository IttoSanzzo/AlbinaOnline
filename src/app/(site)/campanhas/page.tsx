import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { GenericPageContainer } from "@/components/(Design)";
import { SetNavBarModules } from "@/libs/stp@hooks";
import { PageContextMenu } from "./page.infra/PageContextMenu";

export const metadata: Metadata = assembleMetadata({
	title: "Campanhas",
	icon: getAlbinaApiFullAddress("/favicon/campaigns"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/campaigns"),
	},
	route: "/campanhas",
});

export default async function CampaignsPage() {
	return (
		<GenericPageContainer
			title="Campanhas"
			icon={getAlbinaApiFullAddress("/favicon/campaigns")}
			banner={getAlbinaApiFullAddress("/banner/campaigns")}>
			<SetNavBarModules contextMenuButton={PageContextMenu} />
			<PageView />
		</GenericPageContainer>
	);
}
