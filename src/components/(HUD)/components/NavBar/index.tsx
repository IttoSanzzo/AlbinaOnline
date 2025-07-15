import {
	NavBarContainer,
	NavSideContainer,
	ProfileButtonContainer,
} from "./styledElements";
import { ProfileButton } from "@/components/(SPECIAL)";
import { Breadcrumbs, HideSideBarButton, NavBarModules } from "./subComponents";

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
