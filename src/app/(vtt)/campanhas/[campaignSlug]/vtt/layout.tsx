import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./layout.module.css";
import { ReactNode } from "react";

const LayoutContainer = newStyledElement.div(styles.layoutContainer);

interface LayoutProps {
	children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
	return <LayoutContainer>{children}</LayoutContainer>;
}
