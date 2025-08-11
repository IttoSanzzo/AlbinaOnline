import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const EmptyLineContainer = newStyledElement.div(styles.emptyLineContainer);

export function EmptyLine() {
	return <EmptyLineContainer />;
}
