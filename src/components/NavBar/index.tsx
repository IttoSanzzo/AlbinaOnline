import FavoriteButton from "../FavoriteButton";
import ProfileButton from "../ProfileButton";
import Breadcrumb from "./components/Breadcrumb";
import HideSideBarButton from "./components/HideSideBarButton";
import LastEditDate from "./components/LastEditDate";
import {
	NavBarContainer,
	NavMiscsContainer,
	ProfileButtonContainer,
} from "./styledComponents";

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
