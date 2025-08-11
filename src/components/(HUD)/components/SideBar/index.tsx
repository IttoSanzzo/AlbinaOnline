import Image from "next/image";
import albinaLogo from "@/../public/AlbinaLogo.png";
import Link from "next/link";
import IndexedPagesGroups from "./subComponents/IndexedPagesGroups";
import { DataInitComplete } from "./subComponents/DataInitComplete";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const SideBarActivationArea = newStyledElement.div(
	styles.sideBarActivationArea
);
const SideBarContainer = newStyledElement.div(styles.sideBarContainer);
const HeaderContainer = newStyledElement.div(styles.headerContainer);
const AlbinaTitle = newStyledElement.div(styles.albinaTitle);
const ActivePageTitle = newStyledElement.h6(styles.activePageTitle);
const FooterContainer = newStyledElement.div(styles.footerContainer);

export async function SideBar() {
	return (
		<>
			<DataInitComplete />
			<SideBarActivationArea />
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
		</>
	);
}
