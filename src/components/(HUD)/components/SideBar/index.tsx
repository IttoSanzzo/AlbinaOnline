import Image from "next/image";
import {
	ActivePageTitle,
	AlbinaTitle,
	FooterContainer,
	HeaderContainer,
	IndexedPageGroups,
	SideBarActivationArea,
	SideBarContainer,
} from "./styledElements";
import albinaLogo from "@/../public/AlbinaLogo.png";
import Link from "next/link";
import IndexedPagesGroup from "./subComponents/IndexedPagesGroup";

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

				<IndexedPageGroups>
					<IndexedPagesGroup
						groupName="Favorites"
						indexedPages={[
							{ name: "1", link: "1" },
							{ name: "2", link: "2" },
							{ name: "3", link: "3" },
							{ name: "4", link: "4" },
						]}
					/>
					<IndexedPagesGroup
						groupName="Core Hub"
						indexedPages={[
							{ name: "Maestrias", link: "/maestrias" },
							{ name: "Raças", link: "/racas" },
							{ name: "Items", link: "/items" },
							{ name: "Skills", link: "/skills" },
							{ name: "Spells", link: "/spells" },
							{ name: "Traços", link: "/tracos" },
						]}
					/>
					<IndexedPagesGroup
						groupName="Your Chars"
						indexedPages={[{ name: "Albina Online", link: "/" }]}
					/>
				</IndexedPageGroups>
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
