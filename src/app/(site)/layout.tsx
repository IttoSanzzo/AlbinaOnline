import { SideBar, NavBar, AnchorNavBar } from "@/components/(HUD)";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./layout.module.css";
import { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

const GlobalContainer = newStyledElement.div(styles.globalContainer);
const MainContainer = newStyledElement.div(styles.mainContainer);
const PageContainer = newStyledElement.div(styles.pageContainer);

export default function Layout({ children }: LayoutProps) {
	return (
		<GlobalContainer>
			<SideBar />
			<MainContainer>
				<NavBar />
				<PageContainer>{children}</PageContainer>
			</MainContainer>
			<AnchorNavBar />
		</GlobalContainer>
	);
}
