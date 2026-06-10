"use client";

import { GenericPageContainer } from "@/components/(Design)";
import {
	AnchorProps,
	Breadcrumb,
	SetAnchorNavigation,
	SetBreadcrumbs,
	useCurrentUser,
} from "@/libs/stp@hooks";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Security } from "./subComponents/Security";
import { redirect } from "next/navigation";
import { Connections } from "./subComponents/Connections";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Conexões" },
	{ name: "Contas Externas", indentation: 1 },
	{ name: "Outras Conexões", indentation: 1 },
	{ name: "Outras" },
	{ name: "Segurança" },
];

interface UserConfigurationUserPageContentProps {
	username: string;
}
export default function UserConfigurationUserPageContent({
	username,
}: UserConfigurationUserPageContentProps) {
	const currentUser = useCurrentUser();

	if (currentUser.loading || currentUser.user === null) return null;
	const { user } = currentUser;
	if (user.username != username) redirect(`/users/${username}`);

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/users",
			name: "Users",
			icon: getAlbinaApiFullAddress("/favicon/users"),
		},
		{
			href: `/users/${username}`,
			name: user.nickname,
			icon: user.iconUrl,
		},
		{
			href: "#",
			name: "Configurações",
			icon: getAlbinaApiFullAddress("/favicon/default/configuration"),
		},
	];

	return (
		<GenericPageContainer
			title={"Configurações"}
			banner={getAlbinaApiFullAddress("/banner/default/configuration")}
			icon={getAlbinaApiFullAddress("/favicon/default/configuration")}
			subTitle={user.nickname}>
			<SetAnchorNavigation anchors={anchorNavigationData} />
			<Connections />
			<Security />
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
		</GenericPageContainer>
	);
}
