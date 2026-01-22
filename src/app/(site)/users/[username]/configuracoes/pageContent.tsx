"use client";

import { GenericPageContainer } from "@/components/(Design)";
import {
	Breadcrumb,
	SetAnchorNavigation,
	SetBreadcrumbs,
	useCurrentUser,
} from "@/libs/stp@hooks";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Security } from "./subComponents/Security";
// import { newStyledElement } from "@setsu-tp/styled-components";
// import styles from "./styles.module.css";

// const UserFavoriteCarouselContainer = newStyledElement.div(
// styles.UserFavoriteCarouselContainer,
// );

const anchorNavigationData = [{ name: "Segurança", id: "seguranca" }];

interface UserConfigurationUserPageContentProps {
	username: string;
}
export default function UserConfigurationUserPageContent({
	username,
}: UserConfigurationUserPageContentProps) {
	const currentUser = useCurrentUser();

	if (currentUser.loading || currentUser.user === null) return null;
	const { user } = currentUser;

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
			<Security
			// username={username}
			/>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
		</GenericPageContainer>
	);
}
