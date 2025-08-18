import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ReactNode } from "react";

const MainContainer = newStyledElement.div(styles.mainContainer);

interface GenericModPageContainerProps {
	children: ReactNode;
}
export function GenericModPageContainer({
	children,
}: GenericModPageContainerProps) {
	return <MainContainer>{children}</MainContainer>;
}
