import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const PageHeaderContainer = newStyledElement.div(
	styles.pageHeaderContainer
);
export const PageTitle = newStyledElement.h1(styles.pageHeaderContainer);
