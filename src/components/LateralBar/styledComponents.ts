import { newStyledComponent } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const LateralBarContainer = newStyledComponent.div(
	styles.lateralBarContainer
);
export const HeaderContainer = newStyledComponent.div(styles.headerContainer);
export const AlbinaTitle = newStyledComponent.div(styles.albinaTitle);
export const ActivePageTitle = newStyledComponent.h6(styles.activePageTitle);
export const IndexedPageGroups = newStyledComponent.div(
	styles.indexedPageGroups
);
