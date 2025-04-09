import LateralBar from "@/components/LateralBar";
import NavBar from "@/components/NavBar";
import { newStyledComponent } from "@setsu-tp/styled-components";
import styles from "./layout.module.css";
import { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

const GlobalContainer = newStyledComponent.div(styles.globalContainer);
const MainContainer = newStyledComponent.div(styles.mainContainer);

export default function Layout({ children }: LayoutProps) {
	return (
		<GlobalContainer>
			<LateralBar />
			<MainContainer>
				<NavBar />
				{children}
			</MainContainer>
		</GlobalContainer>
	);
}
