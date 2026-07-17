import { ProfileButton } from "@/components/(SPECIAL)";
import { Breadcrumbs, HideSideBarButton, NavBarModules } from "./subComponents";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { PageSearchButton } from "./subComponents/PageSearchButton";
import { env } from "process";
import Link from "next/link";
import Image from "next/image";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const NavBarContainer = newStyledElement.div(styles.navBarContainer);
const NavSideContainer = newStyledElement.div(styles.navSideContainer);
const HomeLink = newStyledElement.div(styles.homeLink);

const ProfileButtonContainer = newStyledElement.div(
	styles.profileButtonContainer,
);

export function NavBar() {
	return (
		<NavBarContainer
			className={
				env.NODE_ENV == "development" ? styles.inDevelopment : undefined
			}>
			<HideSideBarButton />
			<NavSideContainer style={{ marginLeft: "40px" }}>
				<HomeLink>
					<Link href={"/home"}>
						<Image
							src={getAlbinaApiFullAddress("/favicon/home")}
							alt=""
							width={25}
							height={25}
						/>
					</Link>
				</HomeLink>
				<Breadcrumbs />
			</NavSideContainer>
			<NavSideContainer>
				<PageSearchButton />
				<NavBarModules />
				<ProfileButtonContainer>
					<ProfileButton />
				</ProfileButtonContainer>
			</NavSideContainer>
		</NavBarContainer>
	);
}
