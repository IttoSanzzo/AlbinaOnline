import SideBar from "@/components/(HUD)/SideBar";
import NavBar from "@/components/(HUD)/NavBar";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./layout.module.css";
import { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

const GlobalContainer = newStyledElement.div(styles.globalContainer);
const MainContainer = newStyledElement.div(styles.mainContainer);

export default function Layout({ children }: LayoutProps) {
	return (
		<GlobalContainer>
			<SideBar />
			<MainContainer>
				<NavBar />
				{children}
			</MainContainer>
		</GlobalContainer>
	);
}
