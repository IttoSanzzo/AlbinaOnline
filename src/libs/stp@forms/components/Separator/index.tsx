import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const SeparatorLine = newStyledElement.span(styles.separatorLine);

export function Separator() {
	return <SeparatorLine />;
}
