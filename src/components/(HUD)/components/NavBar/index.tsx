import Breadcrumb from "./subComponents/Breadcrumb";
import HideSideBarButton from "./subComponents/HideSideBarButton";
import { NavBarContainer, NavMiscsContainer } from "./styledElements";
import UserPageMisc from "./subComponents/UserPageMisc";

export function NavBar() {
	return (
		<NavBarContainer>
			<NavMiscsContainer>
				<HideSideBarButton />
				<Breadcrumb />
			</NavMiscsContainer>
			<UserPageMisc />
		</NavBarContainer>
	);
}
