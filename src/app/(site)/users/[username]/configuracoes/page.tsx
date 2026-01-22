import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import UserConfigurationUserPageContent from "./pageContent";

interface UserConfigurationPageServerShellProps {
	params: Promise<{
		username: string;
	}>;
}
export async function generateMetadata({
	params,
}: UserConfigurationPageServerShellProps): Promise<Metadata> {
	const { username } = await params;

	return assembleMetadata({
		title: `Configurações`,
		description: `Configurações`,
		icon: getAlbinaApiFullAddress("/favicon/default/configuration"),
		ogImage: {
			url: getAlbinaApiFullAddress("/favicon/default/configuration"),
		},
		route: `/users/${username}/configuracoes`,
	});
}
export default async function UserConfigurationPageServerShell({
	params,
}: UserConfigurationPageServerShellProps) {
	const { username } = await params;

	return <UserConfigurationUserPageContent username={username} />;
}
