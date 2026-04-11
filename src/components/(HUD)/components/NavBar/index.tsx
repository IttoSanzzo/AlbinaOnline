import { ProfileButton } from "@/components/(SPECIAL)";
import { Breadcrumbs, HideSideBarButton, NavBarModules } from "./subComponents";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { PageSearchButton } from "./subComponents/PageSearchButton";
import { env } from "process";

const NavBarContainer = newStyledElement.div(styles.navBarContainer);
const NavSideContainer = newStyledElement.div(styles.navSideContainer);

const ProfileButtonContainer = newStyledElement.div(
	styles.profileButtonContainer,
);

export function NavBar() {
	return (
		<NavBarContainer
			style={
				env.NODE_ENV == "development"
					? {
							background:
								"repeating-linear-gradient(45deg, var(--cl-yellow-600) 0px, var(--cl-yellow-600) 20px, var(--cl-gray-700) 20px, var(--cl-gray-700) 40px)",
						}
					: undefined
			}>
			<NavSideContainer>
				<HideSideBarButton />
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
