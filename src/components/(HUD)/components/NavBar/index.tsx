import { FavoriteButton, ProfileButton } from "../../index";
import Breadcrumb from "./subComponents/Breadcrumb";
import HideSideBarButton from "./subComponents/HideSideBarButton";
import LastEditDate from "./subComponents/LastEditDate";
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
				<LastEditDate />
				<FavoriteButton />
				<ProfileButtonContainer>
					<ProfileButton />
				</ProfileButtonContainer>
			</NavMiscsContainer>
		</NavBarContainer>
	);
}
