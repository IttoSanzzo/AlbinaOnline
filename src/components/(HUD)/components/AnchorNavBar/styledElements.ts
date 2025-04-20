import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const AnchorNavBarContainer = newStyledElement.div(
	styles.anchorNavBarContainer
);
export const AnchorLines = newStyledElement.div(styles.anchorLines);
export const AnchorLine = newStyledElement.span(styles.anchorLine);
export const TableOfContents = newStyledElement.div(styles.tableOfContents);
export const AnchorItem = newStyledElement.div(styles.anchorItem);
