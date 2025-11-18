import { Metadata } from "next";
import UserPageContent from "./pageContent";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";

interface UserPageServerShellProps {
	params: Promise<{
		username: string;
	}>;
}
export async function generateMetadata({
	params,
}: UserPageServerShellProps): Promise<Metadata> {
	const { username } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/users/${username}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-user-${username}`],
			},
		}
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "User Not Found",
		});
	}
	const data: MetadataData = await response.json();
	return assembleMetadata({
		title: data.title,
		description: data.description,
		icon: data.icon,
		ogImage: {
			url: data.ogImage,
		},
		route: `/users/${username}`,
	});
}
export default async function UserPageServerShell({
	params,
}: UserPageServerShellProps) {
	const { username } = await params;

	return <UserPageContent username={username} />;
}
