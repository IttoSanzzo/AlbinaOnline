import { newStyledComponent } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const SideBarActivationArea = newStyledComponent.div(
	styles.sideBarActivationArea
);
export const SideBarContainer = newStyledComponent.div(styles.sideBarContainer);
export const HeaderContainer = newStyledComponent.div(styles.headerContainer);
export const AlbinaTitle = newStyledComponent.div(styles.albinaTitle);
export const ActivePageTitle = newStyledComponent.h6(styles.activePageTitle);
export const IndexedPageGroups = newStyledComponent.div(
	styles.indexedPageGroups
);
export const FooterContainer = newStyledComponent.div(styles.footerContainer);
