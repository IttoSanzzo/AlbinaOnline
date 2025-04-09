import FavoriteButton from "../FavoriteButton";
import ProfileButton from "../ProfileButton";
import Breadcrumb from "./components/Breadcrumb";
import LastEditDate from "./components/LastEditDate";
import {
	NavBarContainer,
	NavMiscsContainer,
	PageMiscsButton,
	ProfileButtonContainer,
} from "./styledComponents";

export default function NavBar() {
	return (
		<NavBarContainer>
			<Breadcrumb />
			<NavMiscsContainer>
				<LastEditDate />
				<>Share</>
				<FavoriteButton />
				<PageMiscsButton>...</PageMiscsButton>
				<ProfileButtonContainer>
					<ProfileButton />
				</ProfileButtonContainer>
			</NavMiscsContainer>
		</NavBarContainer>
	);
}
