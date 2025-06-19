import FavoriteButton from "./subComponents/FavoriteButton";
import ProfileButton from "./subComponents/ProfileButton";
import Breadcrumb from "./subComponents/Breadcrumb";
import HideSideBarButton from "./subComponents/HideSideBarButton";
import {
	NavBarContainer,
	NavMiscsContainer,
	ProfileButtonContainer,
} from "./styledElements";

export function NavBar() {
	return (
		<NavBarContainer>
			<NavMiscsContainer>
				<HideSideBarButton />
				<Breadcrumb />
			</NavMiscsContainer>
			<NavMiscsContainer>
				<FavoriteButton />
				<ProfileButtonContainer>
					<ProfileButton />
				</ProfileButtonContainer>
			</NavMiscsContainer>
		</NavBarContainer>
	);
}
