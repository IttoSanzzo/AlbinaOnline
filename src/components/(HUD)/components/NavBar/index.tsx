import Breadcrumb from "./subComponents/Breadcrumb";
import HideSideBarButton from "./subComponents/HideSideBarButton";
import {
	NavBarContainer,
	NavSideContainer,
	ProfileButtonContainer,
} from "./styledElements";
import NavBarModules from "./subComponents/NavBarModules";
import { FavoriteButton, ProfileButton } from "@/components/(SPECIAL)";

export function NavBar() {
	return (
		<NavBarContainer>
			<NavSideContainer>
				<HideSideBarButton />
				<Breadcrumb />
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
