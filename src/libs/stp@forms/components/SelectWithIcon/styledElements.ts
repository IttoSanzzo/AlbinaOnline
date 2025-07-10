import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const SelectContainer = newStyledElement.div(styles.selectContainer);
export const SelectLabel = newStyledElement.label(styles.selectLabel);
export const SelectError = newStyledElement.div(styles.selectError);
