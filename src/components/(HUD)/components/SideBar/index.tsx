import Image from "next/image";
import {
	ActivePageTitle,
	AlbinaTitle,
	FooterContainer,
	HeaderContainer,
	SideBarActivationArea,
	SideBarContainer,
} from "./styledElements";
import albinaLogo from "@/../public/AlbinaLogo.png";
import Link from "next/link";
import IndexedPagesGroups from "./subComponents/IndexedPagesGroups";

export function SideBar() {
	return (
		<SideBarActivationArea>
			<SideBarContainer>
				<HeaderContainer>
					<Link href={"/home"}>
						<AlbinaTitle>
							<Image
								src={albinaLogo}
								alt="Albina Logo"
								width={30}
								height={30}
							/>
							<h6>Albina Online</h6>
						</AlbinaTitle>
						<ActivePageTitle>Home</ActivePageTitle>
					</Link>
				</HeaderContainer>

				<IndexedPagesGroups />

				<FooterContainer>
					<div>
						<Image
							src={albinaLogo}
							alt=""
							width={18}
							height={18}
						/>
						<Link
							target="blank"
							href={
								"https://albinarpg.notion.site/Log-de-Atualiza-es-0c26870f43e3499ab666c2fd673c1fa5"
							}>
							Update Logs
						</Link>
					</div>
					<footer>
						Created by{" "}
						<a
							href="https://github.com/IttoSanzzo"
							target="blank">
							Itto Sanzzo
						</a>
					</footer>
				</FooterContainer>
			</SideBarContainer>
		</SideBarActivationArea>
	);
}
