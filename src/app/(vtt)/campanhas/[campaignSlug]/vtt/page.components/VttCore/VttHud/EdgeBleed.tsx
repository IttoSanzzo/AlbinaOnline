import styles from "./EdgeBleed.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";

const EdgeBleedContainer = newStyledElement.div(styles.edgeBleedContainer);

export function EdgeBleed() {
	return <EdgeBleedContainer />;
}
