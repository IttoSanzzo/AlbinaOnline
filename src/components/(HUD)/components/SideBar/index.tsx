import Image from "next/image";
import Link from "next/link";
import IndexedPagesGroups from "./subComponents/IndexedPagesGroups";
import { DataInitComplete } from "./subComponents/DataInitComplete";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { StandartTextColor } from "@/components/(UIBasics)";

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
					<Link
						href={"/changelogs"}
						style={{ color: StandartTextColor.gray }}>
						<div>
							<Image
								src={getAlbinaApiFullAddress("/favicon/misc/changelog")}
								alt=""
								width={18}
								height={18}
							/>
							Changelogs
						</div>
					</Link>
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
