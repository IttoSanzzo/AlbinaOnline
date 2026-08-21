import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { redirect } from "next/navigation";
import { Guid } from "@/libs/stp@types";

export async function generateMetadata({
	searchParams,
}: ConvitePageProps): Promise<Metadata> {
	const { token } = await searchParams;

	return assembleMetadata({
		title: "Convite de Campanha",
		icon: getAlbinaApiFullAddress("/favicon/campaigns"),
		ogImage: {
			url: getAlbinaApiFullAddress("/banner/campaigns"),
		},
		route: `/campanhas/convite${token ? `?token=${token}` : ""}`,
	});
}

interface ConvitePageProps {
	searchParams: Promise<{
		token?: string;
	}>;
}
export default async function ConvitePage({ searchParams }: ConvitePageProps) {
	const { token } = await searchParams;

	if (!token || !Guid.isGuid(token)) redirect("/campanhas");
	const inviteResponse = await fetch(
		getAlbinaApiFullAddress(`/campaigns/invites/${token}`),
	);
	if (!inviteResponse.ok) redirect("/campanhas");

	const campaignResponse = await fetch(
		getAlbinaApiFullAddress(`/campaigns/invites/${token}/campaign`),
	);
	if (!campaignResponse.ok) redirect("/campanhas");

	const invictorResponse = await fetch(
		getAlbinaApiFullAddress(`/campaigns/invites/${token}/user`),
	);
	if (!invictorResponse.ok) redirect("/campanhas");

	return (
		<PageView
			invite={await inviteResponse.json()}
			campaign={await campaignResponse.json()}
			invictor={await invictorResponse.json()}
		/>
	);
}
