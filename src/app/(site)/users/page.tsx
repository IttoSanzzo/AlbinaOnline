import { Metadata } from "next";
import UsersPageContent from "./pageContent";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { GenericPageContainer } from "@/components/(Design)";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Usuários",
	icon: getAlbinaApiFullAddress("/favicon/core-page/users"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/users"),
	},
	route: "/users",
});

export default function CharsPageServerShell() {
	return (
		<GenericPageContainer
			title="Todos os Usuários"
			icon={getAlbinaApiFullAddress("/favicon/core-page/users")}
			banner={getAlbinaApiFullAddress("/banner/core-page/users")}>
			<UsersPageContent />
		</GenericPageContainer>
	);
}
