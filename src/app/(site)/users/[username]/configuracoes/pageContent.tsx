"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
// import { newStyledElement } from "@setsu-tp/styled-components";
// import styles from "./styles.module.css";

// const UserFavoriteCarouselContainer = newStyledElement.div(
// styles.UserFavoriteCarouselContainer,
// );

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
			banner={
				"https://i.pinimg.com/originals/ec/ea/8a/ecea8a51e4ae263afe3268d4a15ffb6e.gif"
			}
			// banner={getAlbinaApiFullAddress("/banner/default/configuration")}
			icon={getAlbinaApiFullAddress("/favicon/default/configuration")}
			subTitle={user.nickname}>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
		</GenericPageContainer>
	);
}
