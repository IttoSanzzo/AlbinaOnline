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
const AlbinaTitle = newStyledElement.h6(styles.albinaTitle);
const ActivePageTitle = newStyledElement.h6(styles.activePageTitle);
const FooterContainer = newStyledElement.div(styles.footerContainer);

export async function SideBar() {
	return (
		<>
			<DataInitComplete />
			<SideBarActivationArea />
			<SideBarContainer>
				<Link href={"/home"}>
					<HeaderContainer>
						<Image
							src={"/favicon.png"}
							alt="Albina Logo"
							width={50}
							height={50}
						/>
						<div>
							<AlbinaTitle>Albina Online</AlbinaTitle>
							<ActivePageTitle>Home</ActivePageTitle>
						</div>
					</HeaderContainer>
				</Link>

				<IndexedPagesGroups />

				<FooterContainer>
					<div>
						<Image
							src={
								"https://www.google.com/s2/favicons?domain=https://www.notion.com/&sz=512"
							}
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
