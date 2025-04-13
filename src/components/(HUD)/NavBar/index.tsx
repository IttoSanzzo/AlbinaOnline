import FavoriteButton from "../FavoriteButton";
import ProfileButton from "../ProfileButton";
import Breadcrumb from "./subComponents/Breadcrumb";
import HideSideBarButton from "./subComponents/HideSideBarButton";
import LastEditDate from "./subComponents/LastEditDate";
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
