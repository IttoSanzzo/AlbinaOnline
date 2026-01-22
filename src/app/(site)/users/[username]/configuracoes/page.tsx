import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";
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

	const response = await fetch(
		getAlbinaApiFullAddress(`/users/${username}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-user-${username}`],
			},
		},
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "User Not Found",
		});
	}
	const data: MetadataData = await response.json();
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
