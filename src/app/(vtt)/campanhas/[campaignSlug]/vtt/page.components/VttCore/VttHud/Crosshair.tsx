import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./Crosshair.module.css";

const CrosshairPointer = newStyledElement.div(styles.crosshairPointer);

export function Crosshair() {
	return <CrosshairPointer />;
}
