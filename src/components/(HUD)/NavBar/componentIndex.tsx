import FavoriteButton from "../FavoriteButton/componentIndex";
import ProfileButton from "../ProfileButton/componentIndex";
import Breadcrumb from "./subComponents/Breadcrumb/componentIndex";
import HideSideBarButton from "./subComponents/HideSideBarButton/componentIndex";
import LastEditDate from "./subComponents/LastEditDate/componentIndex";
import {
	NavBarContainer,
	NavMiscsContainer,
	ProfileButtonContainer,
} from "./styledElements";

export default function NavBar() {
	return (
		<NavBarContainer>
			<NavMiscsContainer>
				<HideSideBarButton />
				<Breadcrumb />
			</NavMiscsContainer>
			<NavMiscsContainer>
				<LastEditDate />
				<FavoriteButton />
				<ProfileButtonContainer>
					<ProfileButton />
				</ProfileButtonContainer>
			</NavMiscsContainer>
		</NavBarContainer>
	);
}
