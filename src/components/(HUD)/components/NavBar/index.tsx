import { ProfileButton } from "@/components/(SPECIAL)";
import { Breadcrumbs, HideSideBarButton, NavBarModules } from "./subComponents";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const NavBarContainer = newStyledElement.div(styles.navBarContainer);
const NavSideContainer = newStyledElement.div(styles.navSideContainer);

const ProfileButtonContainer = newStyledElement.div(
	styles.profileButtonContainer
);

export function NavBar() {
	return (
		<NavBarContainer>
			<NavSideContainer>
				<HideSideBarButton />
				<Breadcrumbs />
			</NavSideContainer>
			<NavSideContainer>
				<NavBarModules />
				<ProfileButtonContainer>
					<ProfileButton />
				</ProfileButtonContainer>
			</NavSideContainer>
		</NavBarContainer>
	);
}
