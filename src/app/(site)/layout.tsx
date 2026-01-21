import { SideBar, NavBar, AnchorNavBar } from "@/components/(HUD)";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./layout.module.css";
import { ReactNode } from "react";
import { DiceRoller } from "@/components/(SPECIAL)";

interface LayoutProps {
	children: ReactNode;
}

const GlobalContainer = newStyledElement.div(styles.globalContainer);
const MainContainer = newStyledElement.div(styles.mainContainer);
const PageContainer = newStyledElement.div(styles.pageContainer);

export default async function Layout({ children }: LayoutProps) {
	return (
		<>
			<GlobalContainer>
				<MainContainer>
					<NavBar />
					<PageContainer>
						{children}
						<DiceRoller />
					</PageContainer>
				</MainContainer>
				<SideBar />
			</GlobalContainer>
			<AnchorNavBar />
		</>
	);
}
